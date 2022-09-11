import { createContext, useEffect, useState } from 'react'
import route from 'next/router'
import firebase from '../../firebase/config'
import Usuario from '../../model/Usuario'
import Cookies from 'js-cookie'

interface AuthContextProps {
  usuario?: Usuario
  loginGoogle?: () => Promise<void>
  logout?: () => Promise<void>
  carregando?: boolean
  login?: (email: string, senha: string) => Promise<void>
  cadastrar?: (email: string, senha: string) => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({})

async function usuarioNormalizado(usuarioFirebase: firebase.User): Promise<Usuario> {
  const token = await usuarioFirebase.getIdToken()

  return {
    uid: usuarioFirebase.uid,
    nome: usuarioFirebase.displayName,
    email: usuarioFirebase.email,
    token,
    provedor: usuarioFirebase.providerData[0].providerId,
    imagemUrl: usuarioFirebase.photoURL
  }
}

function gerenciarCookie(logado: boolean) {

  if (logado) {
    Cookies.set('admin-template-cod3r-auth', `${logado}`, {
      expires: 7
    })
  } else {
    Cookies.remove('admin-template-cod3r-auth')
  }
}

export function AuthProvider(props) {
  const [carregando, setCarregando] = useState(true)
  const [usuario, setUsuario] = useState<Usuario>(null)


  async function configurarSessao(usuarioFirebase) {
    if (usuarioFirebase?.email) {
      const usuario = await usuarioNormalizado(usuarioFirebase)
      setUsuario(usuario)
      gerenciarCookie(true)
      setCarregando(false)
      return usuario.email
    } else {
      setUsuario(null)
      gerenciarCookie(false)
      setCarregando(true)
      return false
    }
  }

  async function login(email, senha) {

    try {
      setCarregando(true)
      const resp = await firebase.auth().signInWithEmailAndPassword(email, senha)

      await configurarSessao(resp.user)
      route.push('/')

    } finally {
      setCarregando(false)
    }

  }

  async function cadastrar(email, senha) {

    try {
      setCarregando(true)
      const resp = await firebase.auth().createUserWithEmailAndPassword(email, senha)


      await configurarSessao(resp.user)
      route.push('/')

    } finally {
      setCarregando(false)
    }

  }


  async function loginGoogle() {

    try {
      setCarregando(true)
      const resp = await firebase.auth().signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      )

      if (resp.user?.email) {
        const usuario = await usuarioNormalizado(resp.user)

        await configurarSessao(resp.user)
        route.push('/')
      }
    } finally {
      setCarregando(false)
    }

  }

  async function logout() {
    try {
      setCarregando(true)
      await firebase.auth().signOut()
      await configurarSessao(null)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    if (Cookies.get('admin-template-cod3r-auth')) {
      const cancelar = firebase.auth().onIdTokenChanged(configurarSessao)
      return () => cancelar()
    } else {
      setCarregando(false)
    }
  }, [])


  return (

    <AuthContext.Provider value={{
      usuario,
      loginGoogle,
      logout,
      carregando,
      login,
      cadastrar
    }}>
      {props.children}
    </AuthContext.Provider>

  )
}

export default AuthContext