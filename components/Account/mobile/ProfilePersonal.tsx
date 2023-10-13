import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import debounce from 'lodash.debounce'
import { PatternFormat } from 'react-number-format'
import { yupResolver } from '@hookform/resolvers/yup'
import dayjs from 'utils/dayjs'
import { useProfileData } from 'hooks/useProfileData'
import {
  convertStateNameToAccents,
  getStateFromSigla,
} from 'hooks/useProfileData/states'
import isNotEmpty from 'utils/checkForEmpty'
import { getCep } from 'hooks/useViaCep'
import useIncompleteProfile from '@/hooks/useIncompleteProfile'
import { Input } from '@/components/Input'
import { validationPersonalInfoSchema } from '../Schema/validationPersonalInfo'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function MyData() {
  const { t } = useTranslation(['common'])
  const { regions, save, profileData } = useProfileData()
  const { incompleteProfile } = useIncompleteProfile()
  const formOptions = {
    resolver: yupResolver(validationPersonalInfoSchema),
    criteriaMode: 'firstError',
    mode: 'all',
  }

  const { register, handleSubmit, formState, setValue, getValues, control } =
    useForm(formOptions)
  const { errors } = formState

  register('mobile')
  register('cpf')
  register('birthDate')
  register('postalCode')
  register('newsEmail')
  register('newsSMS')
  register('name')
  register('region')

  useEffect(() => {
    let name = profileData.firstname + ' ' + profileData.surname
    name = name.trim()
    if (isNotEmpty(name)) {
      setValue('name', name)
    }

    setValue('username', profileData.username)
    setValue('email', profileData.email)
    setValue('phone', profileData.phone?.replace(/[^\d]+/g, ''))

    if (!incompleteProfile) {
      setValue('mobile', profileData.mobile?.replace(/[^\d]+/g, ''))
      setValue('postalCode', profileData.postalCode?.replace(/[^\d]+/g, ''))
      setValue('address1', profileData.address1)
      setValue('address2', profileData.address2)
      setValue('city', profileData.city)
      setValue('region', profileData.region)
    }

    setValue('newsEmail', profileData.userConsents?.emailmarketing || false)
    setValue('newsSMS', profileData.userConsents?.sms || false)

    if (isNotEmpty(profileData.birthDate)) {
      setValue(
        'birthDate',
        dayjs(profileData.birthDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      )
    }

    const cpf = profileData.personalID?.replace(/[^\d]+/g, '')
    if (isNotEmpty(cpf)) {
      setValue('cpf', cpf)
    }
  }, [incompleteProfile, profileData, regions, setValue])

  const debouncedSave = useCallback(
    debounce(async (nextValue) => {
      const { data, error } = await getCep(nextValue)
      if (error) {
        return null
      }
      setValue('postalCode', data.cep)
      setValue('address1', data.logradouro)
      setValue('address2', data.complemento)
      setValue('city', data.localidade)
      if (regions.length > 0) {
        const region = regions.find(
          (r) => r.name === getStateFromSigla(data.uf),
        )
        if (region) setValue('region', region.id)
      }
    }, 1000),
    [], // será criada apenas uma vez inicialmente
  )

  const handleChangePostalCode = (event) => {
    const { value } = event.target
    const nextValue = value.replace(/\D/g, '')
    setValue('postalCode', nextValue)
    if (nextValue.length === 8) {
      debouncedSave(nextValue)
    }
  }

  return (
    <form
      className="flex w-full flex-col space-y-6"
      onSubmit={handleSubmit(save)}
    >
      <Input
        {...register('name')}
        id="name"
        name="name"
        isFullWidth
        disabled
        labelMessage={t('Full name')}
        placeholder={t('Full name')}
        errorMessage={errors.name}
      />

      <div>
        <label
          htmlFor="birthDate"
          className="block text-sm font-medium text-white"
        >
          {t('Date of birth')}
        </label>
        <div className="mt-1">
          <Controller
            name="birthDate"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <PatternFormat
                {...field}
                id="birthDate"
                name="birthDate"
                type="text"
                placeholder="01/01/1999"
                disabled
                value={getValues('birthDate')}
                onValueChange={(values) => {
                  const value = values.value.replace(/\D/g, '')
                  setValue('birthDate', value)
                }}
                format="##/##/####"
                className=" w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0"
              />
            )}
          />

          {errors.birthDate?.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.birthDate?.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-white">
          CPF
        </label>
        <div className="mt-1">
          <Controller
            name="cpf"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <PatternFormat
                {...field}
                id="cpf"
                name="cpf"
                type="text"
                format="###.###.###-##"
                placeholder="xxx.xxx.xxx-xx"
                value={getValues('cpf')}
                onValueChange={(values) => {
                  const value = values.value.replace(/\D/g, '')
                  setValue('cpf', value)
                }}
                disabled
                className=" w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0"
              />
            )}
          />
          {errors.cpf?.message && (
            <p className="mt-1 text-left text-sm text-red-500">
              {errors.cpf?.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="mobile"
          className="block text-sm font-medium text-white"
        >
          {t('Phone')}
        </label>
        <div className="mt-1">
          <Controller
            name="mobile"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <PatternFormat
                {...field}
                id="mobile"
                name="mobile"
                type="text"
                format="(##) #####-####"
                placeholder={t('Phone')}
                value={getValues('mobile')}
                onValueChange={(values) => {
                  const value = values.value.replace(/\D/g, '')
                  setValue('mobile', value)
                }}
                className=" w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0"
              />
            )}
          />
          {errors.mobile?.message && (
            <p className="mt-1 text-left text-sm text-red-500">
              {errors.mobile?.message}
            </p>
          )}
        </div>
      </div>

      <Input
        {...register('email')}
        id="email"
        name="email"
        readOnly
        isFullWidth
        labelMessage="Email"
        placeholder="example@mail.com"
        errorMessage={errors.email}
      />

      <div>
        <label
          htmlFor="postalCode"
          className="block text-sm font-medium text-white"
        >
          {t('CEP')}
        </label>
        <div className="mt-1">
          <Controller
            name="postalCode"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <PatternFormat
                {...field}
                format="#####-###"
                id="postalCode"
                name="postalCode"
                value={getValues('postalCode')}
                onChange={handleChangePostalCode}
                type="text"
                placeholder={t('CEP')}
                className=" w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0"
              />
            )}
          />
          {errors.postalCode?.message && (
            <p className="mt-1 text-left text-sm text-red-500">
              {errors.postalCode?.message}
            </p>
          )}
        </div>
      </div>

      <Input
        {...register('address1')}
        id="address1"
        name="address1"
        isFullWidth
        labelMessage={t('Address')}
        placeholder={t('Address')}
        errorMessage={errors.address1}
      />

      <Input
        {...register('address2')}
        id="address2"
        name="address2"
        type="number"
        min={0}
        isFullWidth
        labelMessage={t('Number')}
        placeholder={t('Number')}
        errorMessage={errors.address2}
      />

      <div className="flex w-full items-center justify-between space-x-4">
        <Input
          {...register('city')}
          id="city"
          name="city"
          className="!w-36"
          labelMessage={t('City')}
          placeholder={t('City')}
          errorMessage={errors.city}
        />

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-white"
          >
            {t('State')}
          </label>
          <select
            {...register('region')}
            id="region"
            name="region"
            className=" w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0 lg:text-base"
          >
            {regions?.map((region) => (
              <option key={region.id} value={region.id}>
                {convertStateNameToAccents(region.name)}
              </option>
            ))}
          </select>
          {errors.region?.message && (
            <p className="mt-1 text-left text-sm text-red-500">
              {errors.region?.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Input
          {...register('newsEmail')}
          id="newsEmail"
          name="newsEmail"
          type="checkbox"
          labelMessage={t('I agree to receive offers by email')}
          errorMessage={errors.newsEmail}
        />

        <Input
          {...register('newsSMS')}
          id="newsSMS"
          name="newsSMS"
          type="checkbox"
          labelMessage={t('I agree to receive offers by SMS')}
          errorMessage={errors.newsSMS}
        />
      </div>

      <Button type="submit" size="small">
        {t('Save')}
      </Button>
    </form>
  )
}
