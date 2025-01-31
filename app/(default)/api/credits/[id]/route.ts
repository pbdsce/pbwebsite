import connectMongoDB from '@/lib/dbConnect';
import Credit from '@/models/Credit';

/**
 * @swagger
 * /api/credit/{id}:
 *   patch:
 *     summary: Update a credit entry
 *     description: Updates a credit entry in the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the credit entry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Successfully updated the credit entry
 *       400:
 *         description: ID is required
 *       404:
 *         description: Credit not found
 *       500:
 *         description: Internal server error
 */
export async function PATCH(req: Request) {
    try {
        await connectMongoDB();

        const body = await req.json();
        const url = new URL(req.url);

        const id = url.pathname.split('/').pop();

        if (!id) {
            return new Response(
                JSON.stringify({ success: false, error: "ID is required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const updatedCredit = await Credit.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedCredit) {
            return new Response(
                JSON.stringify({ success: false, error: "Credit not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(
            JSON.stringify({ success: true, updatedCredit }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );

    } catch (error: any) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

/**
 * @swagger
 * /api/credit/{id}:
 *   delete:
 *     summary: Delete a credit entry
 *     description: Deletes a credit entry from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the credit entry to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the credit entry
 *       400:
 *         description: ID is required
 *       404:
 *         description: Credit not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongoDB();

        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ success: false, error: 'ID is required' }),
                {
                    status: 400,
                    headers: { "Content-Type": 'application/json' },
                }
            );
        }

        const deletedCredit = await Credit.findByIdAndDelete(id);

        if (!deletedCredit) {
            return new Response(
                JSON.stringify({ success: false, error: 'Credit not found' }),
                {
                    status: 404,
                    headers: { "Content-Type": 'application/json' },
                }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Contributor deleted successfully' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
