import styled from "styled-components";
import { theme } from "../../styles/theme";

const TmenuSC = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  padding: 5px;

  div:nth-child(1) {
    display: flex;
    align-items: flex-end;
    font-size: 16px;
    font-weight: bold;
  }
  div:nth-child(2) {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    a {
      padding: 7px 11px;
      border-radius: 5px;
      border: solid 1px #282544;
      font-weight: bold;
      margin-left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13.5px;
      &&:hover {
        cursor: pointer;
      }
      svg {
        margin-right: 6px;
      }
    }
  }
`;

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
      background: ${theme.colors.black};
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

const TdDefaultSC = styled.td`
  max-width: ${({ max_w }) => `${max_w}px;`};
  justify-content: ${({ alinharX }) =>
    `${alinharX ? alinharX : "flex-start"};`};
  font-weight: ${({ font_w }) => `${font_w ? font_w : "normal"};`};
  color: ${({ color }) => `${color}`};

  div {
    border-radius: 13px;
    height: 25px;
    width: 110px;
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

    :hover {
      cursor: pointer;
    }
  }
`;

const TdDescriptionSC = styled.td`
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

export const Tmenu = ({ title, children }) => {
  return (
    <TmenuSC>
      <div>{title}</div>
      <div>{children}</div>
    </TmenuSC>
  );
};

export const Table = ({ children }) => {
  return <TableSC>{children}</TableSC>;
};

export const TBody = ({ children }) => {
  return <tbody id="scrollBody">{children}</tbody>;
};

export const Tfoot = ({ children }) => {
  return (
    <tfoot>
      <tr>{children}</tr>
    </tfoot>
  );
};

export const TdDefault = ({
  max_w,
  font_w,
  color,
  alinharX,
  fundoCor,
  corFont,
  children,
}) => {
  return (
    <TdDefaultSC
      max_w={max_w}
      font_w={font_w}
      color={color}
      alinharX={alinharX}
      fundoCor={fundoCor}
      corFont={corFont}
    >
      {children}
    </TdDefaultSC>
  );
};

export const TdDescription = ({
  max_w,
  font_w,
  alinharX,
  descricao,
  children,
}) => {
  return (
    <TdDescriptionSC max_w={max_w} font_w={font_w} alinharX={alinharX}>
      <div>
        <span>{descricao}</span>
        {children}
      </div>
    </TdDescriptionSC>
  );
};
