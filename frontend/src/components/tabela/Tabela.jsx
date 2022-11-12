import { forwardRef } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";

const TableSC = styled.table`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 270px);

  tbody {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    padding: 7px;
    height: 100%;

    tr {
      display: flex;
      margin-bottom: 10px;
      background-color: #fdfdfd;
      box-shadow: 0 0px 5px rgb(0 0 0 / 30%);
      border-radius: 4px;
      padding-left: 12px;
      td {
        height: 55px;
        width: 100%;
        display: flex;
        align-items: center;

        margin: 0px 1%;

        overflow: hidden;
        white-space: nowrap;
      }
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
      width: 5px;
    }
    ::-webkit-scrollbar {
      width: 5px;
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: ${theme.colors.pretoCor};
      border-radius: 99px;
    }
  }

  tfoot {
    tr {
      display: flex;
      justify-content: center;
      background-color: #fdfdfd;
      box-shadow: 0 0px 5px rgb(0 0 0 / 20%);
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
      padding: 9px 30px;
      td {
        height: 37px;
        width: 100%;
        display: flex;
        align-items: center;
        border-right: 1px solid #d4d4d4;

        padding: 0px 2%;

        overflow: hidden;
        white-space: nowrap;

        &:last-child {
          border-right: none;
        }
      }
    }
  }
`;

const TdPadraoSC = styled.td`
  max-width: ${({ max_w }) => `${max_w}px;`};
  justify-content: ${({ alinharX }) =>
    `${alinharX ? alinharX : "flex-start"};`};
  font-weight: ${({ font_w }) => `${font_w ? font_w : "normal"};`};
  color: ${({ color }) => `${color}`};

  div {
    border-radius: 13px;
    height: 25px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.3rem;

    background-color: ${({ fundoCor }) => fundoCor};
    color: ${({ corFont }) => `${corFont}`};
  }

  button {
    background: transparent;
    border: none;
    width: 100%;
    height: 100%;
  }
`;

const TdDescSC = styled.td`
  max-width: ${({ max_w }) => `${max_w}px;`};
  justify-content: ${({ alinharX }) =>
    `${alinharX ? alinharX : "flex-start"};`};
  font-weight: ${({ font_w }) => `${font_w ? font_w : "normal"};`};
  div {
    display: flex;
    flex-direction: column;
    span {
      color: #c1c1c1;
      font-size: 1.2rem;
      margin-bottom: 6px;
      font-weight: 600;
    }
  }
`;

export const Tabela = ({ children }) => {
  return <TableSC>{children}</TableSC>;
};

export const Corpo = forwardRef(({ children }, ref) => {
  return <tbody ref={ref}>{children}</tbody>;
});

export const Rodape = ({ children }) => {
  return (
    <tfoot>
      <tr>{children}</tr>
    </tfoot>
  );
};

export const TdPadr = ({
  max_w,
  font_w,
  color,
  alinharX,
  fundoCor,
  corFont,
  children,
}) => {
  return (
    <TdPadraoSC
      max_w={max_w}
      font_w={font_w}
      color={color}
      alinharX={alinharX}
      fundoCor={fundoCor}
      corFont={corFont}
    >
      {children}
    </TdPadraoSC>
  );
};

export const TdDesc = ({ max_w, font_w, alinharX, descricao, children }) => {
  return (
    <TdDescSC max_w={max_w} font_w={font_w} alinharX={alinharX}>
      <div>
        <span>{descricao}</span>
        {children}
      </div>
    </TdDescSC>
  );
};
