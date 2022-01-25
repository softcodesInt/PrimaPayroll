import React, { useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';

import NavLayout from 'components/layout/dashboard-layout/navbar';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import { useMount } from 'broad-state';
import { deactivateBank, getAllBanks } from 'redux/settings/actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectAllBanks, selectisLoading } from 'redux/settings/selectors';
import { isEmpty } from 'codewonders-helpers';
import Loader from 'components/loader';
import { DashboardSubWrapper } from '../../company-structure';
import AddBank from './add-bank';

const Banks = ({ isLoading, getAllBanks, banks, deactivateBank }) => {
	const [showAddSubsidiaries, setAddSubsidiaries] = useState({
		show: false,
		edit: false,
		data: {},
	});
	useMount(() => {
		getAllBanks();
	});

	return (
		<>
			<NavLayout title="Bank Lists" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Banks</h4>
				<div className="row">
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">No. of Banks</p>
								<h3 className="card-summary-value">{banks?.count || '...'}</h3>
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
									{!isLoading && !isEmpty(banks?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>S/N</th>
													<th>Bank Name</th>
													<th>Bank Code</th>
													<th>Sort Code</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{banks?.results?.map((bank, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{bank.name}</td>
														<td>{bank.bank_code}</td>
														<td>{bank.sort_code}</td>
														<td>
															<span
																className={`status-${
																	bank?.is_active ? 'active' : 'inactive'
																}`}
															>
																{bank?.is_active ? 'Active' : 'Inactive'}
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
																					data: bank,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{bank?.is_active && (
																		<Dropdown.Item
																			href="#!"
																			className="red"
																			onClick={(e) => {
																				e.preventDefault();
																				deactivateBank(bank?.id, true);
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
											No Banks Yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Banks" />
							)}
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>

			<AddBank
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
	banks: selectAllBanks,
});
export default connect(mapStateToProps, {
	getAllBanks,
	deactivateBank,
})(Banks);
