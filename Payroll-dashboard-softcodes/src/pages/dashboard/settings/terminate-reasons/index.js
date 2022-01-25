import React, { useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import NavLayout from 'components/layout/dashboard-layout/navbar';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import { useMount } from 'broad-state';
import {
	deactivateTerminateReason,
	getAllTerminateReason,
} from 'redux/settings/actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
	selectAllTerminateReasons,
	selectisLoading,
} from 'redux/settings/selectors';
import { isEmpty, trunc } from 'codewonders-helpers';
import Loader from 'components/loader';
import { DashboardSubWrapper } from '../../company-structure';
import AddJobTitle from './add-terminate-reason';

const TerminateReason = ({
	isLoading,
	getAllTerminateReason,
	terminateReasons,
	deactivateTerminateReason,
}) => {
	const [showAddSubsidiaries, setAddSubsidiaries] = useState({
		show: false,
		edit: false,
		data: {},
	});
	useMount(() => {
		getAllTerminateReason();
	});

	return (
		<>
			<NavLayout title="Terminate Reason" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Terminate Reasons</h4>
				<div className="row">
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">Terminate Reasons</p>
								<h3 className="card-summary-value">
									{terminateReasons?.count || '...'}
								</h3>
							</div>
						</div>
					</div>
					<div className="col-md-1" />
					<div className="col-md-6" />
				</div>
				<div className="main-table-wrapper mt-5">
					<TableWrap>
						<TableHead>
							<div />
							<button
								type="button"
								className="btn btn-danger table-add-new"
								onClick={() =>
									setAddSubsidiaries((prev) => {
										return { ...prev, show: true, edit: false };
									})
								}
							>
								<Add className="mr-2" /> Add New
							</button>
						</TableHead>

						<TableWrap>
							{!isLoading ? (
								<Table responsive>
									{!isLoading && !isEmpty(terminateReasons?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th className="w-35">Description</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{terminateReasons?.results?.map((title, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{title.name}</td>
														<td>{trunc(title.description, 120)}</td>
														<td>
															<span
																className={`status-${
																	title?.is_active ? 'active' : 'inactive'
																}`}
															>
																{title?.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />

																<Dropdown.Menu>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddSubsidiaries((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: title,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{title?.is_active && (
																		<Dropdown.Item
																			href="#!"
																			className="red"
																			onClick={(e) => {
																				e.preventDefault();
																				deactivateTerminateReason(
																					title?.id,
																					true
																				);
																			}}
																		>
																			Deactivate
																		</Dropdown.Item>
																	)}
																</Dropdown.Menu>
															</Dropdown>
														</td>
													</tr>
												))}
											</tbody>
										</>
									) : (
										<p className="text-center mx-auto  mt-5 no-data">
											No Terminate Reason Yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Terminate Reasons" />
							)}
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>

			<AddJobTitle
				show={showAddSubsidiaries?.show}
				closeModal={() =>
					setAddSubsidiaries((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				data={showAddSubsidiaries?.data}
				isEdit={showAddSubsidiaries?.edit}
			/>
		</>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	terminateReasons: selectAllTerminateReasons,
});
export default connect(mapStateToProps, {
	getAllTerminateReason,
	deactivateTerminateReason,
})(TerminateReason);
