import styled from "@emotion/styled"
import { SearchBox, Spinner, SpinnerSize } from "@fluentui/react"
import React, { useCallback, useEffect, useState } from "react"
import { Button, Text } from "@fluentui/react-components"

import { useSearchMembersLazyQuery } from "$queries"
import { MemberDetailsCard } from "$components/Cards/MemberDetailsCard"
import { useTrackPisteMetric } from "$components/ApplicationInsightsProvider"
import { DefaultPageLayout } from "$components/AppShell/components"

const pageSize = 12

const GridContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 290px));
  margin-top: 2em;
`

function OverviewPage() {
  const pageTitle = "Overview"
  useTrackPisteMetric({ componentName: "OverviewPage" })

  const [fetch, { data: members, fetchMore, loading }] =
    useSearchMembersLazyQuery({
      notifyOnNetworkStatusChange: true,
    })
  const [pageNum, setPageNum] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchMembers = useCallback(() => {
    setPageNum((val) => val + 1)
    fetchMore({
      variables: {
        filter: `%${searchTerm}%`,
        offset: pageSize * (pageNum + 1),
        count: pageSize,
      },
      updateQuery: (existing, incoming) => ({
        AssociationMembers: [
          ...existing.AssociationMembers,
          ...(incoming.fetchMoreResult?.AssociationMembers || {}),
        ],
      }),
    })
  }, [fetchMore, pageNum, searchTerm])

  const onSearch = useCallback(
    (value: string) => {
      if (searchTerm === value) {
        return
      }

      setSearchTerm(value)
      setPageNum(0)
      if (value) {
        fetch({
          variables: {
            filter: `%${value}%`,
            count: pageSize,
          },
        })
      } else {
        fetch({
          variables: {
            filter: "%",
            count: pageSize,
          },
        })
      }
    },
    [fetch, searchTerm]
  )

  useEffect(() => {
    fetch({
      variables: {
        filter: "%",
        count: pageSize,
      },
    })
  }, [fetch])

  return (
    <DefaultPageLayout title={pageTitle}>
      <Text style={{ marginBottom: "2rem" }} block>
        Search by name or club to find any association members.
      </Text>
      <SearchBox placeholder="Search" onSearch={onSearch} />

      <GridContainer>
        {members?.AssociationMembers.map((member) => (
          <MemberDetailsCard
            key={member.AssociationMemberId}
            details={{
              fullName: member.FullName,
              secondaryText:
                member.Club1Name ||
                member.Club2Name ||
                member.Division ||
                member.Birthdate.toString(),
              memberId: member.AssociationMemberId,
              membershipExpiration: member.Expiration,
              birthdate: member.Birthdate,
              foilRating: member.Foil,
              epeeRating: member.Epee,
              sabreRating: member.Saber,
            }}
          />
        ))}
      </GridContainer>

      {loading ? (
        <Spinner size={SpinnerSize.large} style={{ marginTop: "2em" }} />
      ) : (
        <Button
          appearance="primary"
          style={{ margin: "2em auto 0", display: "block" }}
          onClick={fetchMembers}
        >
          Load more
        </Button>
      )}
    </DefaultPageLayout>
  )
}

export default OverviewPage
