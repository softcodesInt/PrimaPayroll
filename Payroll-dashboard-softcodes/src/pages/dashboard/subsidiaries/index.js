import React, { useRef, useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';

/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';
import Input from 'components/input';

/* --------------------------- Image Dependencies --------------------------- */
import Search from 'assets/icons/icon-search.svg';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import { useMount } from 'broad-state';
import {
	deactivateSubsidiary,
	getAllSubsidiary,
} from 'redux/subsidiary/actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
	selectAllSubsidiaries,
	selectisLoading,
} from 'redux/subsidiary/selectors';
import { getAdminUsers } from 'redux/user/actions';
import { debounce, isEmpty } from 'codewonders-helpers';
import Paginate from 'components/pagination';
import Loader from 'components/loader';
import { DashboardSubWrapper } from '../company-structure';
import AddSubsidiaries from './views/add-subsidiary';

const Subsidiaries = ({
	isLoading,
	getAllSubsidiary,
	subsidiaries,
	deactivateSubsidiary,
	getAdminUsers,
}) => {
	const [showAddSubsidiaries, setAddSubsidiary] = useState({
		show: false,
		edit: false,
		data: {},
	});
	useMount(() => {
		getAllSubsidiary();
		getAdminUsers();
	});

	const [searchSubsidiary, setSubsidiary] = useState('');
	const previousStructureRef = useRef('');
	const searchSubsidiaries = debounce(async (value) => {
		if (previousStructureRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllSubsidiary(value);
			}
		}
	}, 500);

	return (
		<>
			<NavLayout title="Subsidiaries" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Subsidiaries</h4>
				<div className="row">
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">No. of Subsidiaries</p>
								<h3 className="card-summary-value">
									{subsidiaries?.count || '...'}
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
							<Input
								placeholder="search..."
								label=""
								background="#E4E6EB"
								icon={Search}
								value={searchSubsidiary}
								onChange={(e) => {
									setSubsidiary(e.target.value);
									previousStructureRef.current = e.target.value;
									searchSubsidiaries(e.target.value);
								}}
								inputClassName="table-search-input"
							/>

							<button
								type="button"
								className="btn btn-danger table-add-new"
								onClick={() =>
									setAddSubsidiary((prev) => {
										return { ...prev, show: true, edit: false };
									})
								}
							>
								Add Subsidiary
							</button>
						</TableHead>

						<TableWrap>
							{!isLoading ? (
								<Table responsive>
									{!isLoading && !isEmpty(subsidiaries?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th>Address</th>
													<th>Is Main Company</th>
													<th>Admin</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{subsidiaries?.results?.map((subsidiary, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{subsidiary.name}</td>
														<td>{subsidiary.address}</td>
														<td>
															{!subsidiary?.is_subsidiary
																? 'Main'
																: 'Subsidiary'}
														</td>
														<td>{`${subsidiary?.admin.first_name} ${subsidiary?.admin.last_name}`}</td>
														<td>
															<span
																className={`status-${
																	subsidiary?.is_active ? 'active' : 'inactive'
																}`}
															>
																{subsidiary?.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />

																<Dropdown.Menu>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddSubsidiary((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: subsidiary,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{subsidiary?.is_active && (
																		<Dropdown.Item
																			href="#!"
																			className="red"
																			onClick={(e) => {
																				e.preventDefault();
																				deactivateSubsidiary(
																					subsidiary?.id,
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
											No Subsidiaries Yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Subsidiaries" />
							)}
							<Paginate
								total={subsidiaries.total_pages}
								next={subsidiaries.next}
								previous={subsidiaries.previous}
								getData={getAllSubsidiary}
								currentPage={subsidiaries?.current_page}
								getNext={() => getAllSubsidiary('', '', subsidiaries?.next)}
								getPrevious={() =>
									getAllSubsidiary('', '', subsidiaries?.previous)
								}
							/>{' '}
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>

			<AddSubsidiaries
				show={showAddSubsidiaries?.show}
				closeModal={() =>
					setAddSubsidiary((prev) => {
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
	subsidiaries: selectAllSubsidiaries,
});
export default connect(mapStateToProps, {
	getAllSubsidiary,
	deactivateSubsidiary,
	getAdminUsers,
})(Subsidiaries);
