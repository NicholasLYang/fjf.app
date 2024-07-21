import { PullRequests } from "@/components/pull-requests";
import { PullRequest, Status } from "@/lib/types";
import { PullRequest as GitHubPullRequest } from "@/__generated__/graphql";
import { auth, signOut } from "@/auth";
import { query } from "@/apollo-client";
import { SignIn } from "@/components/sign-in";
import gql from "graphql-tag";
import { SignOut } from "@/components/sign-out";

const pullRequestsQuery = gql`
  query {
    viewer {
      pullRequests(first: 3, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          title
          number
          repository {
            name
            owner {
              login
            }
          }
          state
        }
      }
    }
  }
`;

export default async function Home() {
  const session = await auth();
  const { data } = await query({ query: pullRequestsQuery });
  const pullRequests = data.viewer.pullRequests.nodes.map(
    (node: GitHubPullRequest) => ({
      title: node.title,
      number: node.number,
      status: node.state === "MERGED" ? Status.Merged : Status.Ready,
      repository: `${node.repository.owner.login}/${node.repository.name}`,
    }),
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>{session ? <SignOut /> : <SignIn />}</div>
      <div className="grow">
        {session && <PullRequests pullRequests={pullRequests} />}
      </div>
    </main>
  );
}
