import styled from "styled-components"
import { PatchQuestion } from "react-bootstrap-icons";
import { theme } from "../../styles/theme"

const ModalConfirmSC = styled.div`
    display:flex;
    flex-direction:column;
    padding: 20px 35px;
    div:nth-child(1){
        display:flex;
        /* justify-content:center; */
        align-items:center;
        flex-direction:column;
        svg{
            font-size: 50px;
            color: ${theme.colors.secondaryColor};
        }
        h1{
            margin-top:20px;
            font-size: ${theme.font.sizes.medium};
        }
    }
    div:nth-child(2){
        margin-top:25px;
        display:flex;
        justify-content:flex-end;
        button{
            font-size: ${theme.font.sizes.small};
            font-family:${theme.font.family.medium};
            border: solid 1px ${theme.colors.secondaryColor};
            border-radius: 4px;
            padding: 6px 17px;
        }
        [data-btn='continuar']{
            background-color:${theme.colors.greeColor};
            margin-right:15px;
        }
        [data-btn='voltar']{
            background-color:transparent;
        }
    }
`

export const ModalConfirmSave = ({ children }) => {
    return (
        <ModalConfirmSC>
            <div>
                <PatchQuestion />
                <h1>Você <b> não salvou</b> as informações, mesmo assim deseja continuar?</h1>
            </div>
            <div>
                {children}
            </div>
        </ModalConfirmSC>
    )
}