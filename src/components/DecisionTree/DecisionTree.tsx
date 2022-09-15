import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import { DecisionTemplate, IDecisionTemplateProps } from "./DecisionTemplate"
import { Dictionary } from "./DecisionTree.types"
import {
  filterChildrenByNodeType,
  getDecisionsDictionary,
  getDefaultDecisionId,
} from "./DecisionTree.utils"
import {
  DecisionTreeContext,
  IDecisionTreeContext,
} from "./DecisionTreeContext"

export interface IDecisionTreeProps {
  defaultDecisionId?: string
}

export const DecisionTree: React.FunctionComponent<IDecisionTreeProps> = (
  props
) => {
  const { children } = props

  // Construct a dictionary of Decisions from the children to
  //  make navigating between decisions easier
  const [decisions, setDecisions] = useState<
    Dictionary<IDecisionTemplateProps>
  >(getDecisionsDictionary(children))

  // Determine the initial decision
  //  If no defaultDecisionId prop was specified, choose the
  //  first decision tree template in the children list
  const initialDecisionId = getDefaultDecisionId(
    props.defaultDecisionId,
    children
  )

  // If no default decision could be determined, throw an exception
  if (!initialDecisionId) {
    const errorMsg = "A DecisionTree with no default decision was detected."
    // eslint-disable-next-line no-console
    console.error(errorMsg)
    throw new Error(errorMsg)
    // If a default decision Id was specified, but no decision matches
  } else if (!decisions[initialDecisionId]) {
    const errorMsg =
      "A DecisionTree with with a default decision Id which does not match any decision was detected."
    // eslint-disable-next-line no-console
    console.error(errorMsg)
    throw new Error(errorMsg)
  }

  const [defaultDecision] = useState(decisions[initialDecisionId])
  const [currentDecision, setCurrentDecision] = useState(defaultDecision)

  // Track the history of all decisions made
  const [history, setHistory] = useState<IDecisionTemplateProps[]>([])

  // If the children change, update the dictionary of decisions
  useEffect(() => {
    const decisions = getDecisionsDictionary(children)
    setDecisions(decisions)
  }, [children])

  // Go to any decision by Id
  const goTo = useCallback(
    (decisionId: string, skipHistory = false) => {
      const decision = decisions[decisionId]
      if (decision) {
        if (!skipHistory) {
          setHistory([...history, currentDecision])
        }
        setCurrentDecision(decision)
      } else {
        const errorMsg = `DecisionTree attempted to navigate to a DecisionId (${decisionId}) that does not exist.`
        // eslint-disable-next-line no-console
        console.error(errorMsg)
        throw new Error(errorMsg)
      }
    },
    [decisions, history, currentDecision]
  )

  // Advance to the next Decision template
  const next = useCallback(() => {
    const { nextId } = currentDecision

    if (nextId) {
      goTo(nextId)
    }
  }, [currentDecision, goTo])

  // Go to the previous Decision template
  const back = useCallback(() => {
    const previousDecision = history.pop()
    if (previousDecision) {
      setCurrentDecision(previousDecision)
    }
  }, [history])

  // Reset to the initial decision
  const reset = useCallback(() => {
    setHistory([])
    setCurrentDecision(defaultDecision)
  }, [defaultDecision])

  // Construct the memoized DecisionTreeContext state to
  //  be shared using the Context API
  const decisionTreeMemo = useMemo(
    () =>
      ({
        decision: currentDecision,
        hasNext: !!currentDecision.nextId,
        hasPrevious: history.length > 0,
        next,
        back,
        reset,
        goTo,
      } as IDecisionTreeContext),
    [currentDecision, next, back, reset, goTo, history.length]
  )

  const decisionTemplates = filterChildrenByNodeType(children, DecisionTemplate)

  // Exclude all but the current active decision template
  return (
    <DecisionTreeContext.Provider value={decisionTreeMemo}>
      {
        // Filter out any decision templates that aren't
        //   the current active decision

        React.Children.toArray(decisionTemplates).filter((node) => {
          if (!React.isValidElement(node)) {
            return false
          }

          const { id } = node.props as ComponentProps<typeof DecisionTemplate>
          return id === currentDecision.id
        })
      }
    </DecisionTreeContext.Provider>
  )
}

export default DecisionTree
