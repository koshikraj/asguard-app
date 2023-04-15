// eslint-disable-file no-use-before-define
import React from 'react';
import styled from 'styled-components';

export const StyledButton = styled.button`
	padding: 1.4rem;
	min-width: 160px;
	font-weight: 600;
	font-size: 16px;
	color: #fff;
	background: linear-gradient(149.86deg, #D844F0 -1.13%, #818CF8 74.76%, #A099FF 143.23%);
	border-radius: 5px;
	cursor: pointer;
`;

export interface ButtonComponentProps {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonComponentProps> = ({
  children,
  ...rest
}) => <StyledButton {...rest}>{children}</StyledButton>;
