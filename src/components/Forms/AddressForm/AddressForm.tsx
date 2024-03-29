import { useCallback } from "react"
import { UseFormReturn } from "react-hook-form"

import { GoogleAddressResult } from "$types"
import { IAddressFormFields } from "."
import { useFormHelpers } from "$hooks/useFormHelpers"
import { IProfileFormFields } from ".."
import { StatesDropdown } from "$components/StatesDropdown"
import { FormAddressAutocomplete } from "$components/Form/components/FormAddressAutocomplete"
import { FormMaskedTextField } from "$components/Form/components/FormMaskedTextField"
import { FormRow } from "$components/Form/components/FormRow"
import { FormSection } from "$components/Form/components/FormSection"
import { FormTextField } from "$components/Form/components/FormTextField"

interface IAddressFormProps {
  form: UseFormReturn<IProfileFormFields, object>
}

export function AddressForm({ form }: IAddressFormProps) {
  const { setFormFields } = useFormHelpers(form)
  const { control } = form

  const setAddressOnAutocomplete = useCallback(
    (address: GoogleAddressResult) => {
      const fields: Partial<IAddressFormFields> = {
        Address: address.address1,
        Address2: address.address2,
        City: address.city,
        Postal: address.postalCode,
      }

      setFormFields(fields)
    },
    [setFormFields]
  )

  return (
    <FormSection>
      <FormRow>
        <FormAddressAutocomplete
          control={control}
          onPlaceSelected={setAddressOnAutocomplete}
          id="address"
          name="Address"
          label="Address"
          required
          placeholder="Address"
          maxLength={128}
          autoComplete="off"
          styles={{ root: { width: "100%" } }}
        />
      </FormRow>

      <FormRow>
        <FormTextField
          control={control}
          name="Address2"
          label="Unit"
          placeholder="Unit"
          maxLength={32}
          autoComplete="address-line2"
        />
        <FormTextField
          control={control}
          name="City"
          label="City"
          placeholder="City"
          required
          maxLength={64}
          autoComplete="address-level1"
        />
      </FormRow>

      <FormRow>
        <StatesDropdown
          control={control}
          name="State"
          required
          style={{ minWidth: 177 }}
        />
        <FormMaskedTextField
          control={control}
          id="postalCode"
          name="Postal"
          label="Postal code"
          mask="99999-9999"
          title="A 5 digit postal code"
          required
          autoComplete="postal-code"
        />
      </FormRow>
    </FormSection>
  )
}
