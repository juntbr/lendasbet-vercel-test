import { useContext, useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { doToast } from 'utils/toastOptions'
import * as Yup from 'yup'
import { AppContext } from '../../../contexts/context'
import { useSession } from '../../../hooks/useSession'
import useEventTracker from '@/hooks/useEventTracker'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager'
import { Button } from 'design-system/button'

export default function ValidateCPF(props) {
  const [loading, setLoading] = useState(false)
  const { session } = useSession()
  const router = useRouter()
  const { appendParamByEventName } = useEventTracker()
  const { setDataLayer } = useGoogleTagManager()
  const query = router.query
  const [ALLOWCPF, setAllowCpf] = useState(
    process.env.NEXT_PUBLIC_ALLOWCPF === 'true',
  )

  const { setUserCpfData } = useContext(AppContext)

  const { t } = useTranslation(['common'])

  const schema = Yup.object({
    cpf: Yup.string()
      .min(11, t('The CPF must have at least 11 characters.'))
      .required(t('It is mandatory to provide the CPF number.'))
      .test('verify-cpf', t('CPF is already in use.'), async (value) => {
        const cpf = value?.replace(/\D/g, '')

        if (cpf?.length < 11) return true
        try {
          const result = await session.call(
            '/user/account#isPersonalIDRegistered',
            { personalId: value },
          )
          return !result.isRegistered
        } catch (e) {
          return false
        }
      }),
  }).required()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'all',
    criteriaMode: 'firstError',
    resolver: yupResolver(schema),
  })

  const onSubmit = (formData: { cpf: string }) => {
    setLoading(true)

    if (ALLOWCPF) {
      props.setActiveStep(2)
      setUserCpfData({
        cpf: formData.cpf,
      })
      setLoading(false)
      return
    }

    axios
      .post('/api/validateCPFCaship', {
        document: formData.cpf,
      })
      .then((res) => {
        const data = res.data.data

        if (data.age < 18) {
          setLoading(false)
          return doToast(
            t(
              'This site is not allowed for individuals under 18 years of age.',
            ),
          )
        }

        const validCPF =
          data.cpf_regular && !data.dead && !data.pep && !data.sanctioned

        if (validCPF || ALLOWCPF) {
          setDataLayer({
            event: 'signup-document-approved',
            user: {
              name: data.name,
              age: data.age,
              cpf: data.cpf,
              gender: data.gender,
            },
          })
          setUserCpfData(data)
          props.setActiveStep(2)
        } else {
          doToast(t('Invalid CPF'))
        }

        setLoading(false)
      })
      .catch((e) => {
        if (ALLOWCPF) {
          props.setActiveStep(2)
          setLoading(false)
          return
        }

        doToast(t('The provided CPF is invalid.'))
        setLoading(false)
      })
  }

  register('cpf')

  useEffect(() => {
    // eslint-disable-next-line no-prototype-builtins
    if (query.hasOwnProperty('sa')) {
      switch (query.sa) {
        case 'allowcpf':
          setAllowCpf(true)
          break
      }
    }
  }, [query])

  useEffect(() => {
    const EVENT_NAME = 'signup-initiated'
    appendParamByEventName(EVENT_NAME, true)
  }, [])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col space-y-4 lg:max-w-md"
    >
      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-white">
          CPF
        </label>
        <PatternFormat
          id="cpf"
          name="cpf"
          type="text"
          format="###.###.###-##"
          placeholder="xxx.xxx.xxx-xx"
          onValueChange={(values) => setValue('cpf', values.value)}
          className=" mt-0.5 w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0"
        />
        {errors.cpf && (
          <p className="mt-2 text-xs  text-red-500 lg:text-sm">
            {errors.cpf.message?.toString()}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" size="large" loading={loading}>
        {t('Next')}
      </Button>
    </form>
  )
}
