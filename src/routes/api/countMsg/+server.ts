/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

export async function POST({ request, locals }) {
    const { recordId } = await request.json();

    try {
        const record = await locals.pb.collection('2_lm_prospects').getOne(recordId);
    
        const data = {
            "messages": record.messages + 1
        };
        
        const newRecord = await locals.pb.collection('2_lm_prospects').update(record.id, data);
        
        
    } catch (error) {
        console.log(error);
        // Consider handling the error more gracefully, for example, by returning a specific error response
        return new Response(JSON.stringify({ status: 500, success: false, error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const result = {
        status: 200,
        success: true,
    };
    
    // Return a Response object with the result as JSON
    return new Response(JSON.stringify(result), {
        status: 200, // This should match the status inside your result object or be based on actual operation outcome
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
