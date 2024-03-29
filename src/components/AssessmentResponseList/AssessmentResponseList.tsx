import {
  CheckboxVisibility,
  DetailsListLayoutMode,
  ICommandBarItemProps,
  SelectionMode,
  Selection,
  ShimmeredDetailsList,
} from "@fluentui/react"
import {
  AssessmentResponseActions,
  NoImageCardHeader,
} from "./AssessmentResponseList.styles"
import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { evaluationColumns } from "./AssessmentResponseList.data"
import {
  FluentProvider,
  Text,
  Input,
  InputOnChangeData,
  Card,
} from "@fluentui/react-components"
import { SearchRegular } from "@fluentui/react-icons"
import {
  useDeleteAssessmentEvaluationMutation,
  useGetAssessmentEvaluationsByIdQuery,
} from "$queries"
import {
  sortEvaluationsByDate,
  evaluationSearchFactory,
  mapAssessmentEvaluationsToTable,
} from "./AssessmentResponseList.utils"
import { formatLocalLocalizedTime } from "$lib/formatLocalTime"
import { ConfirmDialog } from "$components/ConfirmDialog"
import { useDisclosure } from "$hooks/useDisclosure"
import { AssessmentEvaluation } from "./AssessmentResponseList.types"
import { useNavigate } from "react-router-dom"
import { cacheEvicter } from "$lib/apolloClient"

// TODO: Clean up component and separate into subcomponents

export interface IAssessmentResponseListProps {
  assessmentId: string
}

export function AssessmentResponseList({
  assessmentId,
}: IAssessmentResponseListProps) {
  const [selectedEvaluation, setSelectedEvaluation] = useState<
    AssessmentEvaluation | undefined
  >(undefined)
  const [evaluations, setEvaluations] = useState<AssessmentEvaluation[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<
    AssessmentEvaluation[]
  >([])
  const {
    isOpen: isConfirmDeleteOpen,
    onOpen: openConfirmDelete,
    onClose: closeConfirmDelete,
  } = useDisclosure()
  const navigate = useNavigate()

  const { loading: isEvaluationsLoading } =
    useGetAssessmentEvaluationsByIdQuery({
      variables: {
        assessmentId,
      },
      skip: !assessmentId,
      onCompleted: (data) => {
        const evaluations = mapAssessmentEvaluationsToTable(
          data.assessments_assessment_result
        ).sort(sortEvaluationsByDate)

        setEvaluations(evaluations)
        setFilteredEvaluations(evaluations)
      },
      fetchPolicy: "cache-and-network",
    })

  const [deleteEvaluation, { loading: isDeleteingEvaluation }] =
    useDeleteAssessmentEvaluationMutation({ onCompleted: closeConfirmDelete })

  const responseActions = useMemo(
    (): ICommandBarItemProps[] => [
      {
        key: "edit",
        text: "Edit",
        iconProps: { iconName: "Edit" },
        disabled: !selectedEvaluation,
        onClick: () => {
          if (selectedEvaluation) {
            const evaluationId = selectedEvaluation.evaluationId
            navigate(`/assessments/${assessmentId}/${evaluationId}`)
          }
        },
      },
      {
        key: "delete",
        text: "Delete",
        iconProps: { iconName: "Delete" },
        disabled: !selectedEvaluation,
        onClick: openConfirmDelete,
      },
    ],
    [assessmentId, openConfirmDelete, navigate, selectedEvaluation]
  )

  const selection = useMemo(() => {
    const selection = new Selection<AssessmentEvaluation>({
      onSelectionChanged: () => {
        const selectedItem = getSelectedItem()
        setSelectedEvaluation(selectedItem)
      },
      getKey: (item) => item.evaluationId,
    })

    function getSelectedItem() {
      const items = selection.getSelection()
      return items.length ? items[0] : undefined
    }

    return selection
  }, [])

  const resetFilteredEvaluations = useCallback(() => {
    setFilteredEvaluations(evaluations)
  }, [evaluations])

  const filterEvaluations = useCallback(
    (event: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
      if (data.value) {
        const filterFunc = evaluationSearchFactory(data.value)
        const filteredItems = evaluations.filter(filterFunc)

        setFilteredEvaluations(filteredItems)
      } else {
        resetFilteredEvaluations()
      }
    },
    [resetFilteredEvaluations, evaluations]
  )

  const onDeleteConfirmed = useCallback(() => {
    if (selectedEvaluation) {
      const evaluationId = selectedEvaluation.evaluationId
      deleteEvaluation({
        variables: {
          id: evaluationId,
        },
        update: cacheEvicter({
          typeName: "assessments_assessment_result",
          id: evaluationId,
        }),
      })
    }
  }, [deleteEvaluation, selectedEvaluation])

  return (
    <>
      <Card>
        <NoImageCardHeader
          header={
            <AssessmentResponseActions
              items={responseActions}
              farItems={[
                {
                  key: "search",
                  onRender: () => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 8,
                      }}
                    >
                      <Input
                        contentBefore={<SearchRegular />}
                        placeholder="Filter by name"
                        onChange={filterEvaluations}
                      />
                    </div>
                  ),
                },
              ]}
              ariaLabel="Evaluation actions"
            />
          }
        />

        <ShimmeredDetailsList
          items={filteredEvaluations}
          columns={evaluationColumns}
          selectionMode={SelectionMode.single}
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          checkboxVisibility={CheckboxVisibility.always}
          enableShimmer={isEvaluationsLoading}
          shimmerLines={5}
          selection={selection as any}
        />
      </Card>

      <ConfirmDialog
        hidden={!isConfirmDeleteOpen}
        onClose={closeConfirmDelete}
        onConfirmed={onDeleteConfirmed}
        title="Delete evaluation?"
        confirmLabel="Delete"
        isProcessing={isDeleteingEvaluation}
      >
        <FluentProvider>
          Are you sure you want to permanently delete the evaluation for{" "}
          <Text weight="semibold">{selectedEvaluation?.fencerName}</Text>{" "}
          created on{" "}
          <Text weight="semibold">
            {formatLocalLocalizedTime(selectedEvaluation?.createdAt, "lll")}
          </Text>
          ?
        </FluentProvider>
      </ConfirmDialog>
    </>
  )
}
