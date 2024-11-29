import { PullRequests } from "@/components/pull-requests";
import { Status } from "@/lib/types";
import { PullRequest as GitHubPullRequest } from "@/__generated__/graphql";
import { auth } from "@/auth";
import { query } from "@/apollo-client";
import { SignIn } from "@/components/sign-in";
import { SignOut } from "@/components/sign-out";
import { gql } from "@apollo/client";

const pullRequestsQuery = gql`
  query {
    viewer {
      pullRequests(first: 50, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          title
          number
          repository {
            name
            owner {
              login
            }
          }
          mergeStateStatus
          state
        }
      }
    }
  }
`;

function getStatusFromPullRequest(pr: GitHubPullRequest) {
  if (pr.state === "MERGED") {
    return Status.Merged;
  }
  if (pr.state == "CLOSED") {
    return Status.Closed;
  }
  if (pr.mergeStateStatus === "CLEAN") {
    return Status.Ready;
  }
  return Status.Blocked;
}

export default async function Home() {
  const session = await auth();
  let pullRequestComponent;
  if (session) {
    try {
      const { data } = await query({ query: pullRequestsQuery });
      const pullRequests = data.viewer.pullRequests.nodes.map(
        (node: GitHubPullRequest) => ({
          title: node.title,
          number: node.number,
          status: getStatusFromPullRequest(node),
          repository: `${node.repository.owner.login}/${node.repository.name}`,
        }),
      );
      pullRequestComponent = <PullRequests pullRequests={pullRequests} />;
    } catch (e) {
      for (const error of e.graphQLErrors) {
        if (error.extensions.saml_failure) {
          pullRequestComponent = (
            <div className="max-w-md">
              Failed to fetch pull requests due to SAML failure. You may need to
              authenticate with your organization by visiting{" "}
              <code>https://github.com/organizations/ORGANIZATION/sso</code>.
              After authenticating, log out and log back in to this app.
            </div>
          );
          break;
        }
      }
      pullRequestComponent = pullRequestComponent ?? (
        <div>Failed to fetch pull requests.</div>
      );
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="py-4">{session ? <SignOut /> : <SignIn />}</div>
      <div className="grow">{pullRequestComponent}</div>
    </main>
  );
}
