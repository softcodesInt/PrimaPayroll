/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useRef, useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import moment from 'moment';
import { debounce, isEmpty } from 'codewonders-helpers';
import { useMount } from 'broad-state';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';
import Input from 'components/input';
import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import {
	deactivateCompanyPolicy,
	getAllCompanyPolicy,
} from 'redux/company-policy/actions';
import {
	selectAllCompanyPolicy,
	selectisLoadingCompanyPolicy,
} from 'redux/company-policy/selectors';
import Loader from 'components/loader';
import Paginate from 'components/pagination';
import { capitalize, getTrueKeys } from 'utils';

/* --------------------------- Image Dependencies --------------------------- */
import Search from 'assets/icons/icon-search.svg';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import history from 'utils/history';
import AddRuleInfo from './add-rule-info';

const RuleInfo = ({
	noNav = false,
	getAllCompanyPolicy,
	isLoading,
	company_policy,
	deactivateCompanyPolicy,
}) => {
	const [showAddRuleInfo, setAddRuleInfo] = useState({
		show: false,
		edit: false,
	});

	const [searchStructure, setStructure] = useState('');
	const previousStructureRef = useRef('');

	useMount(() => {
		getAllCompanyPolicy();
	});

	const searchStructures = debounce(async (value) => {
		if (previousStructureRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllCompanyPolicy(value);
			}
		}
	}, 500);

	return (
		<>
			{!noNav && <NavLayout title="Policy" isBack />}
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Policy</h4>
				<div className="main-table-wrapper">
					<TableWrap>
						<TableHead>
							<Input
								placeholder="search ..."
								label=""
								background="#E4E6EB"
								icon={Search}
								value={searchStructure}
								onChange={(e) => {
									setStructure(e.target.value);
									previousStructureRef.current = e.target.value;
									searchStructures(e.target.value);
								}}
								inputClassName="table-search-input"
							/>
							<button
								type="button"
								className="btn btn-danger table-add-new"
								onClick={() =>
									setAddRuleInfo((prev) => {
										return { ...prev, show: true, edit: false };
									})
								}
							>
								<Add className="mr-2" /> Add a new policy
							</button>
						</TableHead>
						<TableWrap>
							<div className="table__wrap-header" />
							{!isLoading ? (
								<Table responsive style={{ minHeight: 250 }}>
									{!isLoading && !isEmpty(company_policy?.results) ? (
										<>
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th>Payment cycle</th>
													<th>Workdays</th>
													<th>Hrs per day, month, week</th>
													<th>Statutory tax year start to end</th>
													<th>Probation months</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{company_policy?.results?.map((company, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{company?.name}</td>
														<td>{capitalize(company?.payment_cycle)}</td>
														<td>
															{getTrueKeys({
																M: company?.works_monday,
																T: company?.works_tuesday,
																W: company?.works_wednesday,
																Thr: company?.works_thursday,
																F: company?.works_friday,
																Sat: company?.works_saturday,
																Sun: company?.works_sunday,
															}).toString()}
														</td>
														<td>
															{company?.hours_per_day},{company?.hours_per_week}
															,{company?.hours_per_month}
														</td>
														<td>
															{moment(company?.statutory_tax_year_start).format(
																'MM/YYYY'
															)}{' '}
															-{' '}
															{moment(company?.statutory_tax_year_end).format(
																'MM/YYYY'
															)}
														</td>
														<td>{company?.probation_months}</td>
														<td>
															<span
																className={`status-${
																	company?.is_active ? 'active' : 'inactive'
																}`}
															>
																{company?.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />

																<Dropdown.Menu>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddRuleInfo((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: company,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{company?.is_active && (
																		<Dropdown.Item
																			href="#!"
																			className="red"
																			onClick={(e) => {
																				e.preventDefault();
																				deactivateCompanyPolicy(
																					company?.id,
																					true
																				);
																			}}
																		>
																			Deactivate
																		</Dropdown.Item>
																	)}
																	<Dropdown.Item
																		href="#!"
																		onClick={(e) => {
																			e.preventDefault();
																			history.push(
																				`/dashboard/policies/pay-period/${company?.id}`
																			);
																		}}
																	>
																		Pay Period
																	</Dropdown.Item>
																</Dropdown.Menu>
															</Dropdown>
														</td>
													</tr>
												))}
											</tbody>
										</>
									) : (
										<p className="text-center m-auto no-data">No Policy Yet</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Policy..." />
							)}
							<Paginate
								total={company_policy?.total_pages}
								next={company_policy?.next}
								currentPage={company_policy?.current_page}
								previous={company_policy?.previous}
								getData={getAllCompanyPolicy}
								getNext={() =>
									getAllCompanyPolicy('', '', company_policy?.next)
								}
								getPrevious={() =>
									getAllCompanyPolicy('', '', company_policy?.previous)
								}
							/>
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>
			<AddRuleInfo
				show={showAddRuleInfo?.show}
				closeModal={() =>
					setAddRuleInfo((prev) => {
						return { ...prev, show: false };
					})
				}
				isEdit={showAddRuleInfo?.edit}
				data={showAddRuleInfo?.data}
			/>
		</>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingCompanyPolicy,
	company_policy: selectAllCompanyPolicy,
});
export default connect(mapStateToProps, {
	getAllCompanyPolicy,
	deactivateCompanyPolicy,
})(RuleInfo);
