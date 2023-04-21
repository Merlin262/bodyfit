import Navbar from '@/components/Navbar'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import TextInput from '@/components/TextInput'
import {
  FaIdBadge,
  FaRuler,
  FaUser,
  FaVenusMars,
  FaWeight,
} from 'react-icons/fa'
import DateInput from '@/components/DateInput'
import SelectInput from '@/components/SelectInput'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { CgSpinner } from 'react-icons/cg'

export default function Complete() {
  const { register, handleSubmit } = useForm()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session) return
    async function getUser() {
      const user = await fetch(`/api/user/${session.user.id}`)
      const res = await user.json()
      if (res) setUser(res)
    }
    getUser()
  }, [session])
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-5xl">
        <CgSpinner className="animate-spin" />
      </div>
    )
  }
  if (status === 'unauthenticated') {
    router.push('/')
  }

  const onSubmit = async (data) => {
    console.log(data)
    async function completeUser() {
      const user = await fetch(`/api/user/complete/${session.user.id}`, {
        body: JSON.stringify({
          name: data.name,
          role: data.role,
          nasc: data.nasc,
          weight: data.weight,
          height: data.height,
          gender: data.gender,
        }),
        method: 'PUT',
      })
      const res = await user.json()
      if (res) {
        if (res?.error) {
          setError(data.error)
          const timeout = setTimeout(() => {
            setError(null)
          }, 2500)
          return () => clearTimeout(timeout)
        } else {
          router.push('/dashboard/')
        }
      }
    }
    completeUser()
  }

  if (user && session && user.id) {
    if (
      !user?.name ||
      !user?.nasc ||
      !user?.weight ||
      !user?.height ||
      !user?.gender
    ) {
      return (
        <>
          <Head>
            <title>Bodyfit - Completar cadastro</title>
          </Head>
          <Navbar>
            <div className="hero">
              <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left lg:space-x-10">
                  <h1 className="text-5xl font-bold lg:ml-10">
                    Só mais um pouco...
                  </h1>
                  <p className="py-6">
                    Precisamos de mais algumas informações para possibilitar o
                    uso do Bodyfit.
                  </p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl">
                  <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <TextInput
                        register={register}
                        label={'name'}
                        icon={<FaIdBadge />}
                        labelText={'Nome'}
                        placeholder={'Digite seu nome'}
                        type={'text'}
                        required
                      />
                      <DateInput
                        label={'nasc'}
                        labelText={'Data de nascimento'}
                        required
                        register={register}
                      />
                      <TextInput
                        register={register}
                        label={'weight'}
                        icon={<FaWeight />}
                        labelText={'Peso (kg)'}
                        placeholder={'Digite seu peso (Ex: 73.5)'}
                        type={'number'}
                        step={'0.1'}
                        pattern={'^[0-9]*$'}
                        required
                      />
                      <TextInput
                        register={register}
                        label={'height'}
                        icon={<FaRuler />}
                        labelText={'Altura (m)'}
                        placeholder={'Digite seu altura (Ex: 1.85)'}
                        type={'number'}
                        step={'0.01'}
                        pattern={'^[0-9]*$'}
                        required
                      />
                      <SelectInput
                        register={register}
                        icon={<FaVenusMars />}
                        label={'gender'}
                        labelText={'Sexo'}
                        pickerText={'Selecione seu sexo'}
                        required
                        options={[
                          { value: 'MASCULINO', label: 'Masculino' },
                          { value: 'FEMININO', label: 'Feminino' },
                          { value: 'OUTRO', label: 'Outro' },
                        ]}
                      />
                      <SelectInput
                        register={register}
                        icon={<FaUser />}
                        label={'role'}
                        labelText={'Tipo de usuário'}
                        pickerText={'Selecione seu tipo de usuário'}
                        required
                        options={[
                          { value: 'USER', label: 'Usuário' },
                          { value: 'PERSONAL', label: 'Personal' },
                        ]}
                      />

                      <div className="form-control mt-6">
                        <button className="btn btn-primary" type="submit">
                          Completar cadastro
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Navbar>
          {error && (
            <Toast
              message={error}
              icon={<FaExclamationTriangle />}
              color="alert-error"
            />
          )}
        </>
      )
    }
    router.push('/dashboard')
  }
}
