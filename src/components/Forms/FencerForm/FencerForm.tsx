import { UseFormReturn } from "react-hook-form"
import dayjs from "dayjs"

import {
  FormTextField,
  FormMaskedTextField,
  FormDatePicker,
  FormRow,
  FormSection,
  IProfileFormFields,
} from "$components"
import { useAccountProfile } from "$hooks"

interface IFencerFormProps {
  form: UseFormReturn<IProfileFormFields, object>
}

export const FencerForm: React.FunctionComponent<IFencerFormProps> = ({
  form,
}) => {
  const { account } = useAccountProfile()
  const { control } = form

  return (
    <FormSection>
      <FormRow>
        <FormTextField
          control={control}
          name="FirstName"
          id="firstName"
          label="First name"
          required
          placeholder="First name"
          maxLength={64}
          autoComplete="given-name"
        />
        <FormTextField
          control={control}
          id="lastName"
          name="LastName"
          label="Last name"
          required
          placeholder="Last name"
          maxLength={64}
          autoComplete="family-name"
        />
      </FormRow>
      <FormRow>
        <FormDatePicker
          control={control}
          name="Birthdate"
          label="Birthdate"
          placeholder="Birthdate"
          ariaLabel="Birthdate"
          allowTextInput
          isRequired
          style={{ maxWidth: 177 }}
          defaultValue={dayjs(account.Birthdate).toDate() as unknown as string}
          maxDate={new Date()}
          formatDate={(date) => dayjs(date).format("M/DD/YYYY")}
        />
      </FormRow>
      <FormRow>
        <FormMaskedTextField
          control={control}
          name="Phone"
          label="Phone number"
          mask="(999) 999-9999"
          title="A 10 digit phone number"
          required
          type="tel"
          autoComplete="tel-national"
        />
      </FormRow>
      <FormRow>
        <FormTextField
          control={control}
          name="Email"
          label="Email"
          required
          placeholder="Email"
          type="email"
          maxLength={64}
          autoComplete="email"
        />
      </FormRow>
    </FormSection>
  )
}
