import React, { useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';

import NavLayout from 'components/layout/dashboard-layout/navbar';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import AddNatureOfContract from './add-nature-of-contract';
import { DashboardSubWrapper } from '../../company-structure';
import { useMount } from 'broad-state';
import {
	deactivateNatureOfContract,
	getAllNatureOfContracts,
} from 'redux/settings/actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
	selectAllNatureOfContracts,
	selectisLoading,
} from 'redux/settings/selectors';
import { isEmpty, trunc } from 'codewonders-helpers';
import Loader from 'components/loader';

const NatureOfContract = ({
	isLoading,
	getAllNatureOfContracts,
	natureOfContracts,
	deactivateNatureOfContract,
}) => {
	const [showAddSubsidiaries, setAddSubsidiaries] = useState({
		show: false,
		edit: false,
		data: {},
	});
	useMount(() => {
		getAllNatureOfContracts();
	});

	return (
		<>
			<NavLayout title="Nature of Contract" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Nature of Contracts</h4>
				<div className="row">
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">No. of Nature of Contracts</p>
								<h3 className="card-summary-value">
									{natureOfContracts?.count || '...'}
								</h3>
							</div>
						</div>
					</div>
					<div className="col-md-1"></div>
					<div className="col-md-6"></div>
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
									{!isLoading && !isEmpty(natureOfContracts?.results) ? (
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
												{natureOfContracts?.results?.map((contract, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{contract.name}</td>
														<td>{trunc(contract.description, 120)}</td>
														<td>
															<span
																className={`status-${
																	contract?.is_active ? 'active' : 'inactive'
																}`}
															>
																{contract?.is_active ? 'Active' : 'Inactive'}
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
																					data: contract,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{contract?.is_active && (
																		<Dropdown.Item
																			href="#!"
																			className="red"
																			onClick={(e) => {
																				e.preventDefault();
																				deactivateNatureOfContract(
																					contract?.id,
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
											No Nature of Contract yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Nature of Contract" />
							)}
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>

			<AddNatureOfContract
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
	natureOfContracts: selectAllNatureOfContracts,
});
export default connect(mapStateToProps, {
	getAllNatureOfContracts,
	deactivateNatureOfContract,
})(NatureOfContract);
