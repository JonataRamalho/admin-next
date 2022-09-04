import { IconceSino, IconeAjustes, IconeCasa } from "../icons/index";
import MenuItem from "./MenuItem";

export default function MenuLateral() {
  return (
    <aside>
      <ul>
        <MenuItem url="/" texto="Início" icone={IconeCasa} />
        <MenuItem url="/ajustes" texto="Ajustes" icone={IconeAjustes} />
        <MenuItem url="/notificacoes" texto="Notificações" icone={IconceSino} />
      </ul>
    </aside>
  )
}