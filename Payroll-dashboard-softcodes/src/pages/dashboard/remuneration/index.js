/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState, useRef } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';

/* --------------------------- Image Dependencies --------------------------- */

import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import { useMount } from 'broad-state';
import Input from 'components/input';
import debounce from 'codewonders-helpers/bundle-cjs/helpers/debounce';
import Search from 'assets/icons/icon-search.svg';

import { DashboardSubWrapper } from 'pages/dashboard/company-structure';

import {
	deactivateRemuneration,
	getAllRemuneration,
} from 'redux/payroll/actions';
import { isEmpty, trunc } from 'codewonders-helpers';
import {
	selectAllRemuneration,
	selectisLoading,
} from 'redux/payroll/selectors';
import { connect } from 'react-redux';
import Paginate from 'components/pagination';
import Loader from 'components/loader';
import { createStructuredSelector } from 'reselect';
import AddRemuneration from './add-remuneration';

const Remuneration = ({
	noNav = false,
	getAllRemuneration,
	isLoading,
	deactivateRemuneration,
	remuneration,
}) => {
	const [showAddRemuneration, setAddRemuneration] = useState({
		show: false,
		edit: false,
		data: {},
	});

	useMount(() => {
		if (isEmpty(remuneration?.results)) {
			getAllRemuneration();
		}
	});

	const searchRemuneration = debounce(async (value) => {
		if (previousStructureRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllRemuneration(value, 1, null);
			}
		}
	}, 500);

	const previousStructureRef = useRef('');
	const [searchElement, setSearchElement] = useState('');

	return (
		<>
			{!noNav && <NavLayout title="Remuneration" isBack />}
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Remuneration</h4>
				<div className="main-table-wrapper">
					<TableWrap>
						<TableHead>
							<Input
								placeholder="Search.."
								label=""
								background="#E4E6EB"
								icon={Search}
								value={searchElement}
								onChange={(e) => {
									setSearchElement(e.target.value);
									previousStructureRef.current = e.target.value;
									searchRemuneration(e.target.value);
								}}
								inputClassName="table-search-input"
							/>
							<button
								type="button"
								className="btn btn-danger table-add-new"
								onClick={() =>
									setAddRemuneration((prev) => {
										return { ...prev, show: true, edit: false };
									})
								}
							>
								<Add className="mr-2" /> Add new
							</button>
						</TableHead>
						<TableWrap>
							{!isLoading ? (
								<Table responsive>
									{!isLoading && !isEmpty(remuneration?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th>Company Policy</th>
													<th>Description</th>
													<th>Payroll Groups</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{remuneration?.results?.map((payroll, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{payroll?.name}</td>
														<td>{payroll?.company_policy?.name}</td>
														<td className="w-25">
															{trunc(payroll?.description, 40)}
														</td>
														<td className="w-35">
															{payroll?.payroll_groups
																?.map((group) => group.name)
																?.join(', ')}
														</td>
														<td>
															<span
																className={`status-${
																	payroll?.is_active ? 'active' : 'inactive'
																}`}
															>
																{payroll?.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />

																<Dropdown.Menu>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddRemuneration((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: 'view',
																					data: payroll,
																				};
																			})
																		}
																	>
																		View
																	</Dropdown.Item>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddRemuneration((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: payroll,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	<Dropdown.Item
																		href="#!"
																		className="red"
																		onClick={(e) => {
																			e.preventDefault();
																			deactivateRemuneration(payroll?.id);
																		}}
																	>
																		Deactivate
																	</Dropdown.Item>
																</Dropdown.Menu>
															</Dropdown>
														</td>
													</tr>
												))}
											</tbody>
										</>
									) : (
										<p className="text-center m-auto no-data">
											No Remuneration Yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Remuneration..." />
							)}{' '}
							<Paginate
								total={remuneration?.total_pages}
								next={remuneration?.next}
								currentPage={remuneration?.current_page}
								previous={remuneration?.previous}
								getData={getAllRemuneration}
								getNext={() => getAllRemuneration('', '', remuneration?.next)}
								getPrevious={() =>
									getAllRemuneration('', '', remuneration?.previout)
								}
							/>{' '}
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>

			<AddRemuneration
				show={showAddRemuneration?.show}
				closeModal={() =>
					setAddRemuneration((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				isEdit={showAddRemuneration?.edit}
				data={showAddRemuneration?.data}
			/>
		</>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	remuneration: selectAllRemuneration,
});
export default connect(mapStateToProps, {
	getAllRemuneration,
	deactivateRemuneration,
})(Remuneration);
