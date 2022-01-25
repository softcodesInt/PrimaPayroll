import React from 'react';
import styled from 'styled-components';
import { isEmpty } from 'codewonders-helpers';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getRemunerationById } from 'redux/payroll/actions';
import {
	selectSingleRemuneration,
	selectisLoading as selectRemunerationLoading,
} from 'redux/payroll/selectors';
import { selectEmployee } from 'redux/employee/selectors';
import Loader from 'components/loader';
import { formatAmount } from 'utils';
import UserPaySlip from './user-payroll';

const PayslipBreakdownDetail = ({
	isLoading,
	employee,
	showHistory = true,
}) => {
	const hasElementType = (elementType) => {
		return employee?.payroll_data[elementType.toLowerCase()];
	};

	return (
		<div className="row">
			{isLoading ? (
				<Loader loadingText="Getting Payslip Values" />
			) : (
				<>
					<div className="col-md-12">
						<p>Payslip Breakdown</p>
					</div>
					<div className="col-md-6">
						{isEmpty(hasElementType('EARNINGS')) ? (
							<ElementWrapper className="main-table-wrapper">
								<DetailText>Earnings</DetailText>
								<LabelText>No Earnings yet</LabelText>
							</ElementWrapper>
						) : (
							<ElementWrapper>
								<DetailText>Earnings</DetailText>
								{hasElementType('EARNINGS')?.map((data) => (
									<ListWrapper>
										<LabelText>{data.name}</LabelText>
										<DetailText>
											<span style={{ fontSize: 12 }}>
												{data.amount !== 'None'
													? formatAmount(data.amount)
													: 'NOT YET SPECIFIED'}
											</span>
										</DetailText>
									</ListWrapper>
								))}
							</ElementWrapper>
						)}
					</div>
					<div className="col-md-6">
						{isEmpty(hasElementType('DEDUCTIONS')) ? (
							<ElementWrapper>
								<DetailText>Deductions</DetailText>
								<LabelText>No Deductions yet</LabelText>
							</ElementWrapper>
						) : (
							<ElementWrapper>
								<DetailText>Deductions</DetailText>
								{hasElementType('DEDUCTIONS')?.map((data) => (
									<ListWrapper>
										<LabelText>{data.name}</LabelText>
										<DetailText>
											{data.amount !== 'None'
												? formatAmount(data.amount)
												: 'NOT YET SPECIFIED'}
										</DetailText>
									</ListWrapper>
								))}
							</ElementWrapper>
						)}
					</div>
					<div className="col-md-6">
						{isEmpty(hasElementType('COMPANY_CONTRIBUTIONS')) ? (
							<ElementWrapper>
								<DetailText>Company Contributions</DetailText>
								<LabelText>No Company Contributions yet</LabelText>
							</ElementWrapper>
						) : (
							<ElementWrapper>
								<DetailText>Company Contributions</DetailText>
								{hasElementType('COMPANY_CONTRIBUTIONS')?.map((data) => (
									<ListWrapper>
										<LabelText>{data.name}</LabelText>
										<DetailText>
											{data.amount !== 'None'
												? formatAmount(data.amount)
												: 'NOT YET SPECIFIED'}
										</DetailText>
									</ListWrapper>
								))}
							</ElementWrapper>
						)}
					</div>
					{/* <div className="col-md-6">
						{isEmpty(hasElementType('FRINGE_BENEFIT')) ? (
							<ElementWrapper>
								<DetailText>Fringe Benefit</DetailText>
								<LabelText>No Fringe Benefit yet</LabelText>
							</ElementWrapper>
						) : (
							<ElementWrapper>
								<DetailText>Fringe Benefits</DetailText>
								{hasElementType('FRINGE_BENEFIT')?.map((data) => (
									<ListWrapper>
										<LabelText>{data.name}</LabelText>
										<DetailText>
											{formatAmount(data.calculation_type_value) ||
												'NOT YET SPECIFIED'}
										</DetailText>
									</ListWrapper>
								))}
							</ElementWrapper>
						)}
					</div>
					<div className="col-md-6">
						{isEmpty(hasElementType('PROVISIONS')) ? (
							<ElementWrapper>
								<DetailText>Provisions</DetailText>
								<LabelText>No Provisions yet</LabelText>
							</ElementWrapper>
						) : (
							<ElementWrapper>
								<DetailText>Provisions</DetailText>
								{hasElementType('PROVISIONS')?.map((data) => (
									<ListWrapper>
										<LabelText>{data.name}</LabelText>
										<DetailText>
											{formatAmount(
												formatAmount(data.calculation_type_value)
											) || 'NOT YET SPECIFIED'}
										</DetailText>
									</ListWrapper>
								))}
							</ElementWrapper>
						)}
					</div>
					<div className="col-md-6">
						{isEmpty(hasElementType('ADDITIONS')) ? (
							<ElementWrapper>
								<DetailText>Additions</DetailText>
								<LabelText>No Additions yet</LabelText>
							</ElementWrapper>
						) : (
							<ElementWrapper>
								<DetailText>Additions</DetailText>
								{hasElementType('ADDITIONS')?.map((data) => (
									<ListWrapper>
										<LabelText>{data.name}</LabelText>
										<DetailText>
											{formatAmount(data.calculation_type_value) ||
												'NOT YET SPECIFIED'}
										</DetailText>
									</ListWrapper>
								))}
							</ElementWrapper>
						)}
					</div> */}

					<section className="col-md-12 mt-4">
						{employee?.id && showHistory && <UserPaySlip id={employee.id} />}
					</section>
				</>
			)}
		</div>
	);
};

const ElementWrapper = styled.div`
	background: #fff;
	box-shadow: 1px 1px 1px 1px #888888;
	border: 1px solid rgb(224, 224, 224);
	padding: 0.1em;
	margin-bottom: 1em;
`;

const ListWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

const LabelText = styled.p`
	font-size: 14px;
	padding-left: 8px;
	padding-right: 8px;
`;

const DetailText = styled.p`
	font-size: 14px;
	font-weight: 700;
	padding-left: 8px;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectRemunerationLoading,
	remuneration: selectSingleRemuneration,
	employee: selectEmployee,
});
export default connect(mapStateToProps, {
	getRemunerationById,
})(PayslipBreakdownDetail);
