import { Octokit } from '@octokit/rest';

// Server-only: GITHUB_PAT is never NEXT_PUBLIC_
const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  download_url: string | null;
}

/** List all PDF files in a subject folder. Returns [] if folder does not exist. */
export async function listFilesInSubject(subjectCode: string): Promise<GitHubFile[]> {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: subjectCode });
    if (Array.isArray(data)) {
      return data.filter((f) => f.name.endsWith('.pdf')) as GitHubFile[];
    }
    return [];
  } catch (e: any) {
    if (e.status === 404) return [];
    throw e;
  }
}

/**
 * Upload a PDF to GitHub.
 * @param base64Content  Raw Base64 string (no data: prefix)
 * @returns commit SHA
 */
export async function uploadFile(
  subjectCode: string,
  filename: string,
  base64Content: string,
  uploaderUsername: string
): Promise<string> {
  const path = `${subjectCode}/${filename}`;

  // Get existing SHA if file already exists (required for updates)
  let sha: string | undefined;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if (!Array.isArray(data)) sha = data.sha;
  } catch {}

  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `Add ${filename} to ${subjectCode} - uploaded by @${uploaderUsername}`,
    content: base64Content,
    sha,
  });

  return data.commit.sha!;
}

/** Returns the raw GitHub CDN URL for a stored PDF. */
export function getFileDownloadUrl(subjectCode: string, filename: string): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/main/${subjectCode}/${filename}`;
}
