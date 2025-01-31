import connectMongoDB from '@/lib/dbConnect';
import Credit from '@/models/Credit';

export async function PATCH(req: Request) {
    try {
        await connectMongoDB();

        const body = await req.json();
        const url = new URL(req.url);

        const id = url.pathname.split('/').pop();

        if(!id) {
            return new Response(
                JSON.stringify({ success: false, error: "ID is required"}),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const updatedCredit = await Credit.findByIdAndUpdate(id,body, {
            new : true,
            runValidators: true,
        });

        if(!updatedCredit) {
            return new Response(
                JSON.stringify({success: false, error: "Credit not found"}),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(
            JSON.stringify({success: true, updatedCredit}),
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
        )
    }
}

export async function DELETE(req: Request , { params }:{ params:{ id: string}}) {
    try {
        await connectMongoDB();

        const { id } = params;

        if(!id) {
            return new Response(
                JSON.stringify({ success:false, error: 'ID is required'}),
                {
                    status: 400,
                    headers: {"Content-Type": 'application/json'},
                }
            );
        }

        const deletedCredit = await Credit.findByIdAndDelete(id);

        if(!deletedCredit) {
            return new Response(
                JSON.stringify({success: false, error: 'Credit not found'}),
                {
                    status: 404,
                    headers: {"Content-Type": 'application/json'},
                }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Contributor deleted successfully'}),
            {
                status: 200,
                headers: {'Content-Type': 'application/json'},
            }
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({ success: false, error: error.message}),
            {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            }
        );
    }
}