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
export async function listFilesInSubject(subjectTitle: string, subjectCode: string): Promise<GitHubFile[]> {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: `${subjectTitle}/${subjectCode}` });
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
  subjectTitle: string,
  subjectCode: string,
  filename: string,
  base64Content: string,
  uploaderUsername: string
): Promise<string> {
  const path = `${subjectTitle}/${subjectCode}/${filename}`;

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

/** Delete a file from GitHub (used by admin when resolving reports). */
export async function deleteFile(
  subjectTitle: string,
  subjectCode: string,
  filename: string,
  adminUsername: string
): Promise<void> {
  const path = `${subjectTitle}/${subjectCode}/${filename}`;
  let sha: string;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if (Array.isArray(data)) return; // unexpected directory — skip
    sha = data.sha;
  } catch (e: any) {
    if (e.status === 404) return; // already gone — treat as success
    throw e;
  }
  await octokit.repos.deleteFile({
    owner,
    repo,
    path,
    message: `Delete ${filename} from ${subjectCode} - by @${adminUsername}`,
    sha,
  });
}

/** Returns the raw GitHub CDN URL for a stored PDF. */
export function getFileDownloadUrl(subjectTitle: string, subjectCode: string, filename: string): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/main/${encodeURIComponent(subjectTitle)}/${encodeURIComponent(subjectCode)}/${encodeURIComponent(filename)}`;
}
