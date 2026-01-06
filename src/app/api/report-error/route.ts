
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { error_message, file_path } = await request.json();

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = 'Itsme23476';
    const REPO_NAME = 'Self-H';

    if (!GITHUB_TOKEN) {
        return NextResponse.json({ error: 'Server Missing GITHUB_TOKEN' }, { status: 500 });
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${GITHUB_TOKEN}`,
            },
            body: JSON.stringify({
                event_type: 'app_error',
                client_payload: {
                    error_message: error_message,
                    file_path: file_path || 'src/app/page.tsx' // Defaulting for demo
                }
            })
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.statusText}`);
        }

        return NextResponse.json({ success: true, message: 'Dispatched to Healer' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
