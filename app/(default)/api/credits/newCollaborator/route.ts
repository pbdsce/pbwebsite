import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/lib/dbConnect";
import cloudinary from 'cloudinary';
import Credit from "@/models/Credit";

cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});
/**
 * @swagger
 * /api/credit:
 *   post:
 *     summary: Fetch GitHub contributors and store them in the database
 *     description: Fetches contributors from a specified GitHub repository, downloads their avatars, uploads them to Cloudinary, and saves contributor details in MongoDB.
 *     tags:
 *      - Credits
 *     responses:
 *       201:
 *         description: Successfully stored new contributors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 newCredits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       githubUrl:
 *                         type: string
 *                         format: uri
 *                       imageUrl:
 *                         type: string
 *                         format: uri
 *       400:
 *         description: Failed to fetch contributors
 *       500:
 *         description: Internal server error
 */

function uploadToCloudinary(fileBuffer: Buffer): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: "credits" },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Cloudinary upload failed"));
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      uploadStream.end(fileBuffer); // Write buffer data and end the stream
    });
  }
  
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();

    const repoOwner = "pbdsce";
    const repoName = "PB_Website";
    const branches = ["prod", "staging"];

    const contributorsSet = new Set<string>();
    const contributors: { id: number; login: string; name?: string; avatar_url: string; html_url: string }[] = [];

    for (const branch of branches) {
      let page = 1;
      let hasMoreCommits = true;

      while (hasMoreCommits) {
        const commitsUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?sha=${branch}&per_page=100&page=${page}`;
        const commitsResponse = await fetch(commitsUrl);
        if (!commitsResponse.ok) {
          if (commitsResponse.status === 429) {
            return NextResponse.json({ error: "GitHub API rate limit exceeded. Try again later or use a GitHub token." }, { status: 429 });
          }
          console.error(`Failed to fetch commits for ${branch}: ${commitsResponse.statusText}`);
          continue;
        }

        const commits = await commitsResponse.json();
        if (commits.length === 0) {
          hasMoreCommits = false;
          break;
        }

        for (const commit of commits) {
          const author = commit.author;
          if (author && !contributorsSet.has(author.login) && author.login !== "dependabot[bot]") {
            contributorsSet.add(author.login);
            contributors.push({
              id: author.id,
              login: author.login,
              name: commit.commit.author?.name,
              avatar_url: author.avatar_url,
              html_url: author.html_url,
            });
          }
        }

        page++;
      }
    }

    if (contributors.length === 0) {
      return NextResponse.json({ error: "No contributors found" }, { status: 400 });
    }

    const newCredits = [];

    for (const contributor of contributors) {
      const { id, name, login, avatar_url, html_url } = contributor;
      const contributorName = name || login;


      const existingCredit = await Credit.findOne({ userId: id });
      if (existingCredit) {
        continue;
      }

      const avatarResponse = await fetch(avatar_url);
      if (!avatarResponse.ok) {
        console.error(`Failed to fetch avatar for ${contributorName}`);
        continue;
      }

      const avatarBuffer = Buffer.from(await avatarResponse.arrayBuffer());
      const { secure_url, public_id } = await uploadToCloudinary(avatarBuffer);

      const newCredit = new Credit({
        userId: id,
        name: contributorName,
        githubUrl: html_url,
        imageUrl: secure_url,
        publicId: public_id,
      });

      await newCredit.save();
      newCredits.push(newCredit);
    }

    return NextResponse.json({ success: true, newCredits }, { status: 201 });
  } catch (error) {
    console.error("Error creating credits:", error);
    return NextResponse.json({ error: "Failed to create credits" }, { status: 500 });
  }
}