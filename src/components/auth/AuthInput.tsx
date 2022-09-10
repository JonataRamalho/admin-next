interface AuthInputProps {
  label: string
  valor: any
  tipo?: 'text' | 'email' | 'password'
  obrigatorio?: boolean
  naoRenderizarQuando?: boolean
  valorMudou: (novoValor: any) => void
}

const AuthInput = (props: AuthInputProps) => {
  return props.naoRenderizarQuando ? null : (
    <div className="flex flex-col mt-4">
      <label>{props.label}</label>
      <input
        type={props.tipo ?? 'text'}
        value={props.valor}
        onChange={e => props.valorMudou?.(e.target.value)}
        required={props.obrigatorio}
        className={`
          px-4 py-3 rounded-lg bg-gray-200 mt-2
          border focus:bg-white
          focus:outline-none
        `}
      />
    </div>
  )
}

export default AuthInput