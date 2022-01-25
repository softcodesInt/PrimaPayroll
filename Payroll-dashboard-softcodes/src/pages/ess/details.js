/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import NavLayout from 'components/layout/dashboard-layout/navbar';
import { selectAuthUser, selectisLoading } from 'redux/user/selectors';
import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import { formatAmount } from 'utils';

const Details = ({ user }) => {
	return (
		<>
			<NavLayout title="My Details" isBack />
			<DashboardSubWrapper className="wrapper-contain ml-5 mr-5">
				<h4 className="page-main-title">Employment Details</h4>
				<div className="row">
					<div className="card main-table-wrapper">
						<div className="card-body">
							<div className="row">
								<div className="col-md-6 col-sm-6">
									<p className="summary-title mb-5 underline-p">
										Personal Information
									</p>
									<InfoWrapper>
										<Title>First Name:</Title>
										<Info>{user.first_name}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Last Name:</Title>
										<Info>{user.last_name}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Other Name:</Title>
										<Info>{user.other_name || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Personal Email:</Title>
										<Info>{user.personal_email || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Marital Status:</Title>
										<Info>{user.marital_status || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Gender:</Title>
										<Info>{user.gender || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Date Of Birth:</Title>
										<Info>{user.date_of_birth || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Phone Number:</Title>
										<Info>{user.phone_number || 'N/A'}</Info>
									</InfoWrapper>
									<p className="summary-title mb-5 mt-5 underline-p">
										Next Of Kin Information
									</p>
									<InfoWrapper>
										<Title>Name:</Title>
										<Info>{user.next_of_kin_name || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Phone Number:</Title>
										<Info>{user.next_of_kin_phone_number || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Email:</Title>
										<Info>{user.next_of_kin_email || 'N/A'}</Info>
									</InfoWrapper>
								</div>
								<div className="col-md-6 col-sm-6">
									<p className="summary-title mb-5 underline-p">
										Employment Information
									</p>
									<InfoWrapper>
										<Title>Employee Code:</Title>
										<Info>{user.employee_code || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Job Title:</Title>
										<Info>{user.job_title?.name || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Job Grade:</Title>
										<Info>{user.job_grade?.name || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Date Engaged:</Title>
										<Info>{user.date_engaged}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Nature Of Contract:</Title>
										<Info>{user.nature_of_contract?.name || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Pension Pin:</Title>
										<Info>{user.pension_pin || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>NHF:</Title>
										<Info>{user.nhf || 'N/A'}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Tax Identification Number:</Title>
										<Info>{user.tax_identification_number || 'N/A'}</Info>
									</InfoWrapper>
									<p className="summary-title mb-5 mt-5 underline-p">
										Salary Breakdown
									</p>
									<InfoWrapper className="list-item-details">
										<Title>Base Monthly Salary:</Title>
										<Info>{formatAmount(user.rates_per_month)}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Base Annual Salary:</Title>
										<Info>{formatAmount(user.rates_per_year)}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Bank Name:</Title>
										<Info>{user.bank?.name}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Account Number:</Title>
										<Info>{user.account_number}</Info>
									</InfoWrapper>
									<InfoWrapper>
										<Title>Account Name:</Title>
										<Info>{user.account_name}</Info>
									</InfoWrapper>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DashboardSubWrapper>
		</>
	);
};

const InfoWrapper = styled.div`
	display: flex;
	flex-direction: row;
	margin-bottom: 1rem;
`;

const Title = styled.p`
	text-transform: capitalize;
	font-weight: bold !important;
	width: 35% !important;
`;

const Info = styled.p`
	padding-left: 2rem;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	user: selectAuthUser,
});

export default connect(mapStateToProps, {})(Details);
