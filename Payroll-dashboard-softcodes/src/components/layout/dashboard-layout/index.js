import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SidebarLayout from './sidebar';

const propTypes = {
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};

const defaultProps = {
	children: <></>,
};

const DashbaordLayout = ({ children }) => {
	return (
		<>
			<SidebarLayout />

			<Main>{children}</Main>
		</>
	);
};

const Main = styled.main`
	margin-left: auto;
	-webkit-transition: all 0.4s ease-in-out;
	background: #f5f7fb !important;

	width: calc(100% - 255px);

	transition: all 0.4s ease-in-out;
	@media (max-width: 990px) {
		padding: 5.5rem 1.35rem;
		width: 100%;
		.wrapper-contain {
			max-width: 100%;

			margin-left: auto;
			margin-right: auto;
		}
		margin: 0;
	}
	display: block;
	background: #f7f9fa;
	padding: 4.5rem 2.85rem;

	min-height: 100vh;
	.wrapper-contain {
		margin-top: 3rem;
	}
	@media (min-width: 1200px) {
		.wrapper-contain {
			max-width: 1336px;

			margin-left: auto;
			margin-right: auto;
		}
	}
`;

export const TableHead = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.6rem;
	h4 {
		font-style: normal;
		font-weight: 500;
		font-size: var(--font-h4);
		line-height: 23px;
		/* identical to box height */
		margin: 0;
		letter-spacing: -0.015em;

		/* Text/Black */

		color: var(--text-black);
	}
	.sorter button {
		margin-left: 1rem;
		padding: 0px 10px;
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.02em;
		color: #000000;
		background: transparent;
		border: none;
		&:focus,
		&:hover,
		&:active {
			color: #000000;
			background: transparent !important;
		}
	}
`;
export const TableWrap = styled.div`
	background: #ffffff;
	border-radius: ${(props) => (props.noPadding ? '0px' : '8px')};
	padding: ${(props) => (props.noPadding ? '0px' : ' 15px 25px 4px')};
	.table__wrap-header {
		padding-top: 15px;
		h4 {
			font-style: normal;
			font-weight: 500;
			font-size: var(--font-h4);
			line-height: 23px;
			/* identical to box height */

			letter-spacing: -0.015em;

			color: #000000;
		}
		p {
			font-style: normal;
			font-weight: normal;
			font-size: var(--font-p);
			line-height: 18px;
			letter-spacing: 0.02em;

			/* Text/Grey */

			color: var(--text-gray);
		}
		hr {
			border-top: 0.5px solid rgba(0, 0, 0, 0.1);
			margin: 2rem 0;
		}
	}
	.no-data {
		width: 100%;
		display: table-caption;
		font-weight: 800;
		color: #c54224;
	}
	thead {
		th {
			vertical-align: bottom;
			border-bottom: 1px solid rgba(0, 0, 0, 0.2);
			border-top: 0;

			font-style: normal;
			font-weight: 500;
			font-size: var(--font-p);
			line-height: 18px;
			letter-spacing: 0.02em;

			/* Text/Black */

			color: var(--text-black);
		}
	}
	.w-15 {
		width: 10%;
	}
	tbody {
		tr {
			cursor: pointer;
			transition: all 0.4s ease;
			&:hover {
				background: rgba(192, 199, 214, 0.2);
			}
		}
	}
	td {
		font-style: normal;
		font-weight: normal;
		font-size: var(--font-p);
		line-height: 18px;
		letter-spacing: 0.02em;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		padding: 1.5rem 0.75rem;
		/* Text/Grey */

		color: var(--text-gray);
		&.w-32 {
			width: 32%;
		}
		&.w-20 {
			width: 20%;
		}
		a {
			color: var(--primary-blue);
		}
	}
	.color-green {
		color: #279e3a;
	}
	.status-active {
		background: rgba(39, 158, 58, 0.1);
		border: 0.2px solid #279e3a;
		box-sizing: border-box;
		border-radius: 4px;
		font-style: normal;
		padding: 8px 20px;
		text-align: center;
		font-weight: normal;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.02em;

		color: #279e3a;
	}
	.status-inactive {
		background: rgba(197, 65, 36, 0.1);
		border: 0.2px solid #c54124;
		box-sizing: border-box;
		border-radius: 4px;
		font-weight: normal;
		padding: 8px 17.5px;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.02em;

		color: #c54124;
	}
	.dropdown a {
		color: #141515;
		&.red {
			color: #cb563d;
		}
	}
`;

DashbaordLayout.defaultProps = defaultProps;

DashbaordLayout.propTypes = propTypes;

export default DashbaordLayout;
