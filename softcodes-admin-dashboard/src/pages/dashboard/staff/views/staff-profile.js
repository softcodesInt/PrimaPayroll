/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

/* -------------------------- Internal Dependencies ------------------------- */
import Button from 'components/button';
import { SubNavBar } from 'components/layout/dashboard-layout/navbar';
import { DashboardWrapper, DashboardActivities } from '../../';
import {
	selectAuthUser,
	selectCurrentActivity,
	selectisLoading,
} from 'redux/user/selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useMount } from 'broad-state';
import { getUserById, editStaff, deleteStaff } from 'redux/user/actions';
import Loader from 'components/loader';
import { capitalize } from 'utils';
import Avatar from 'components/avatar';
import { Activities } from 'pages/dashboard/companies/views/company-profile';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import Modal from 'components/modal';
import Radio from 'components/radio';
import history from 'utils/history';
import { user_id } from 'utils/user_persist';
import { ReactComponent as Pencil } from 'assets/icons/icon-pencil.svg';

/* ----------------------------- StaffProfile propTypes ---------------------------- */
const propsTypes = {
	staff: PropTypes.object,
	user: PropTypes.object,
	isLoading: PropTypes.bool,
	getUserById: PropTypes.func,
	deleteStaff: PropTypes.func,
};
const StaffProfile = ({
	staff,
	isLoading,
	user: currentUser,
	getUserById,
	editStaff,
	deleteStaff,
}) => {
	const { id: staffId } = useParams();
	const [show, setShow] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [role, setRole] = useState('VIEWER');
	const isNotViewer = !isEmpty(currentUser) && currentUser?.role !== 'VIEWER';
	useMount(() => {
		getUserById(staffId);
	});
	const user = staff?.user;
	return (
		<>
			{!isLoading && !isEmpty(staff) ? (
				<>
					<SubNavBar isBack>
						<div>
							<Link to="/dashboard/staff" className="back mb-3 d-block">
								{'<'} BACK
							</Link>

							<div className="other__information-text d-flex align-items-center">
								{' '}
								<h3 className="d-flex align-items-center">
									{user_id === user?.id && (
										<div className="upload__image">
											<div className="upload__image-wrap">
												<Pencil />
												<input type="file" />
											</div>
										</div>
									)}
									{user?.profile_image ? (
										<img
											src={user?.profile_image}
											className="rounded-circle"
											alt="profile"
										/>
									) : (
										<Avatar
											data={{
												first_name: user?.first_name || 'a',
												last_name: user?.last_name || 'a',
											}}
										/>
									)}
									{user?.first_name} {user?.last_name}
								</h3>
								<p className="mb-0 ml-3">| Role:{capitalize(user?.role)}</p>
							</div>
						</div>

						<div className="d-flex">
							{user_id === user?.id ? (
								<Link
									className="btn-soft sm-size mr-3"
									to={`/dashboard/staff/edit/${user?.id}`}
								>
									Edit Profile
								</Link>
							) : (
								<>
									{isNotViewer && (
										<>
											<Button
												className="btn-soft sm-size mr-3"
												onClick={() => {
													setRole(user?.role);
													setShow(true);
												}}
											>
												Edit Role
											</Button>
											<Button
												className="btn btn-light-red"
												onClick={() => setShowDelete(true)}
											>
												Remove
											</Button>
										</>
									)}
								</>
							)}
						</div>
					</SubNavBar>
					<DashboardWrapper>
						<DashboardList className="mt-0">
							<div className="row">
								<div className="col-md-8">
									<div className="card">
										<div className="card-body">
											<div className="tile-header d-flex align-items-center">
												<h4>Activity</h4>
												<select
													className="custom-select"
													onChange={(e) => {
														if (e.target?.value === 'company') {
															history.push('/dashboard/companies');
														}
														if (e.target?.value === 'staff') {
															history.push('/dashboard/staff');
														}
													}}
												>
													<option>Filter by</option>
													<option value="company">Filter by Company</option>
													<option value="staff">Filter by Staff</option>
												</select>
											</div>
											<Activities data={staff?.activity} />
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="card mb-4">
										<div className="card-body">
											<div className="tile-header variation-2">
												<h4>Companies Managing</h4>
											</div>
											{!isEmpty(staff?.managing) ? (
												<>
													{staff?.managing?.map((manage) => (
														<div className="companies-tile">
															<div className="companies-tile-details d-flex align-items-center">
																<Avatar data={manage?.name} isTile />
																<h4>{manage?.name}</h4>
															</div>
														</div>
													))}
												</>
											) : (
												<div className="companies-tile">
													<h4>No comapnies managing</h4>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</DashboardList>
					</DashboardWrapper>
				</>
			) : (
				<Loader loadingText="Getting Staff" />
			)}
			<Modal show={show} closeModal={setShow} title={''}>
				<ModalWrapper>
					<h4>Update Role</h4>
					<div>
						<label className="mb-3">
							{user?.first_name} {user?.last_name}'s Role: (select one)
						</label>
						<Radio
							name="role"
							type="radio"
							checked={role === 'VIEWER'}
							value="VIEWER"
							onChange={() => setRole('VIEWER')}
						>
							{' '}
							<p className="radio">
								Viewer: <small>can only view</small>
							</p>
						</Radio>
						<Radio
							name="role"
							type="radio"
							checked={role === 'OPERATOR'}
							value="OPERATOR"
							onChange={() => setRole('OPERATOR')}
						>
							{' '}
							<p className="radio">
								Operator: <small>can view and edit public information</small>
							</p>
						</Radio>
						<Radio
							name="role"
							type="radio"
							checked={role === 'ADMIN'}
							value="ADMIN"
							onChange={() => setRole('ADMIN')}
						>
							{' '}
							<p className="radio">
								Admin: <small> can view, edit and assess all information</small>
							</p>
						</Radio>
					</div>
					<Button
						type="submit"
						className="btn-soft mt-5"
						isLoading={isLoading}
						disabled={isLoading}
						onClick={async () => {
							await editStaff(user?.id, { role });
							setShow(false);
						}}
					>
						Update Role
					</Button>
				</ModalWrapper>
			</Modal>
			<Modal show={showDelete} closeModal={setShowDelete} title={'Warning'}>
				<ModalWrapper>
					<p>
						Are you sure you want to delete{' '}
						<strong>
							{user?.first_name} {user?.first_name}
						</strong>
						, This action is irreversible.
					</p>

					<Button
						type="submit"
						className="btn btn-danger mt-3"
						isLoading={isLoading}
						disabled={isLoading}
						onClick={async () => {
							await deleteStaff(user?.id);
							setShowDelete(false);
						}}
					>
						Delete User
					</Button>
				</ModalWrapper>
			</Modal>
		</>
	);
};

export const ModalWrapper = styled.div`
	label {
		font-style: normal;
		font-weight: normal;
		font-size: 13.2px;
		line-height: 15px;
		/* identical to box height */

		/* Text/Black */

		color: #141515;
	}
	p {
		font-style: normal;
		font-weight: 400;
		font-size: 15px;
		line-height: 18px;

		/* Text/Black */

		color: #141515;
	}
	h4 {
		font-weight: 500;
		font-size: 21.875px;
		line-height: 28px;
		letter-spacing: -0.015em;

		/* Text/Black */

		color: #141515;
		margin-bottom: 1rem;
	}
	.radio {
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.02em;

		color: #141515;
	}
`;
export const DashboardList = styled(DashboardActivities)``;
StaffProfile.propTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	user: selectAuthUser,
	staff: selectCurrentActivity,
});
export default connect(mapStateToProps, {
	getUserById,
	editStaff,
	deleteStaff,
})(StaffProfile);
