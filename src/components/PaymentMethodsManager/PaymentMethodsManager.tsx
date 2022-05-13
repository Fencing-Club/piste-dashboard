import styled from "@emotion/styled"

import {
  ElementsProvider,
  PaymentMethodForm,
  PaymentMethodCard,
} from "$components"
import { useGetPaymentMethodsQuery } from "$store"

const PaymentMethodsGrid = styled.div`
  display: grid;
  grid-gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, 292px);
`

export const PaymentMethodsManager: React.FunctionComponent = () => {
  const { data: paymentMethods } =
    useGetPaymentMethodsQuery("cus_Kvm41gHVgqbeeS")

  return (
    <>
      <PaymentMethodsGrid>
        {paymentMethods?.map(({ card, id, billing_details }, index) => {
          if (card) {
            return (
              <PaymentMethodCard
                key={id}
                card={card}
                themeIndex={index}
                name={billing_details.name}
                onEditClick={(event, card) => console.log("EDIT", card)}
              />
            )
          } else {
            return null
          }
        })}
      </PaymentMethodsGrid>
      <ElementsProvider>
        <PaymentMethodForm />
      </ElementsProvider>
    </>
  )
}