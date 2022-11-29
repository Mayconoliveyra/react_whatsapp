import MaskedInput from "react-text-mask";
import { Form, Field, ErrorMessage } from "formik";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { theme } from "../../styles/theme";

const FormSC = styled(Form)`
  box-shadow: 0 0px 5px rgb(0 0 0 / 27%);
  background-color: #fdfdfd;
  border-radius: 4px;
  padding: 1.2rem 2rem;
  margin-top: 5px;
`;

const GroupSC = styled(Col)`
  padding: 0px 4px;
  label {
    font-family: ${theme.font.family.medium};
    font-size: ${theme.font.sizes.small};
  }

  input, select {
    display: block;
    width: 100%;
    padding: 0.27rem 0.5rem;
    font-size: ${theme.font.sizes.xsmall};
    color: #212529;
    background-color: #fff;
    border: 1px solid #ced4da;
    border-radius: 0.15rem;

    &:focus {
      border: solid 1px #33355b;
    }
  }

  select {
      padding: 0.35rem 0.5rem;
  }
  
  small {
    margin-left: 3px;
    color: #fe316c;
  }
`;

export const FormC = (props) => {
  return (
    <FormSC>
      <Row>{props.children}</Row>
    </FormSC>
  );
};

export const GroupC = ({ name, label, type = "text", autocomplete = "off", maxlength = 255, mask = false,
  sm, md, lg = 6, xl = 4, xxl = 3 }) => {
  const propsGroup = {
    sm,
    md,
    lg,
    xl,
    xxl,
  };
  return (
    <GroupSC {...propsGroup}>
      <label htmlFor={name}>{label}</label>
      {!mask && (
        <Field name={name}>
          {({ field }) => (
            <input
              {...field}
              id={name}
              type={type}
              maxLength={maxlength}
              autoComplete={autocomplete}
              value={field.value || ''}
            />
          )}
        </Field>
      )}
      {!!mask && (
        <Field name={name}>
          {({ field }) => (
            <MaskedInput
              {...field}
              id={name}
              type={type}
              maxLength={maxlength}
              autoComplete={autocomplete}
              mask={mask}
              guide={false}
              value={field.value || ''}
            />
          )}
        </Field>
      )}
      <small>
        <ErrorMessage name={name} />
      </small>
    </GroupSC>
  );
};
export const GroupSelect = ({ name, label, data = [],
  sm, md, lg = 6, xl = 4, xxl = 3 }) => {
  const propsGroup = {
    sm,
    md,
    lg,
    xl,
    xxl,
  };
  return (
    <GroupSC {...propsGroup}>
      <label htmlFor={name}>{label}</label>
      <Field children name={name}>
        {({ field }) => (
          <select
            {...field}
            id={name}
            name={name}
            value={field.value || ''}
          >
            {data.map((item, key) => {
              return <option key={key} value={item.value}>{item.name}</option>
            })}
          </select>
        )}
      </Field>
      <small>
        <ErrorMessage name={name} />
      </small>
    </GroupSC>
  );
};
