import { openChat } from '@/components/Zendesk'
import useEventTracker from '@/hooks/useEventTracker'
import { useSession } from '@/hooks/useSession'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function EmailConfirm() {
  const { isEmailVerified, account } = useSession()
  const { appendParamByEventWthRedirect } = useEventTracker()

  const router = useRouter()

  useEffect(() => {
    if (isEmailVerified) {
      router.push('/cassino')
    }
  }, [isEmailVerified, router])

  useEffect(() => {
    const EVENT_NAME = 'email-confirm'
    appendParamByEventWthRedirect(EVENT_NAME, false)
  }, [])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start space-y-8 p-3 py-20 sm:py-40">
      <Image
        src="/images/email-sent.svg"
        className="h-auto w-40"
        width={40}
        height={40}
        alt="email"
      />
      <h1 className="text-center text-lg font-bold text-neutral-20 lg:text-2xl">
        Abra seu email e faça a confirmação para começar a divertir-se com a
        gente!
        <span className="mt-8 flex w-full flex-col font-bold text-neutral-20">
          Enviamos para o email:{' '}
          <span className="text-primary">{account.email}</span>
        </span>
      </h1>

      <div className="flex justify-center">
        <p className="text-center font-semibold text-neutral-20 lg:text-lg">
          Verifique sua caixa de emails e também a caixa de spam, caso mesmo
          assim não encontre o email,{' '}
          <span
            className="cursor-pointer text-primary underline"
            onClick={openChat}
          >
            entre em contato com o suporte
          </span>
          .
        </p>
      </div>
    </div>
  )
}

export default EmailConfirm
