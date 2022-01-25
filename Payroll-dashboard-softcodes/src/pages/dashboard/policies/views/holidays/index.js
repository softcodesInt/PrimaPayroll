/* eslint-disable no-shadow */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Table } from 'react-bootstrap';
import moment from 'moment';

import NavLayout from 'components/layout/dashboard-layout/navbar';
import Input from 'components/input';

import Search from 'assets/icons/icon-search.svg';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';

import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import { useMount } from 'broad-state';
import { deactivateHoliday, getAllHoliday } from 'redux/company-policy/actions';
import { debounce, isEmpty, trunc } from 'codewonders-helpers';
import {
	selectAllHolidays,
	selectisLoadingHoliday,
} from 'redux/company-policy/selectors';
import { connect } from 'react-redux';
import Paginate from 'components/pagination';
import Loader from 'components/loader';
import { createStructuredSelector } from 'reselect';
import AddHoliday from './add-holiday';

const propTypes = {
	noNav: PropTypes.bool,
	getAllHoliday: PropTypes.func,
	isLoading: PropTypes.bool,
	deactivateHoliday: PropTypes.func,
	holidays: PropTypes.shape,
};

const HolidaySetup = ({
	noNav = false,
	getAllHoliday,
	isLoading,
	deactivateHoliday,
	holidays,
}) => {
	const [showAddHoliday, setAddHoliday] = useState({
		show: false,
		edit: false,
	});

	const [searchStructure, setStructure] = useState('');
	const previousStructureRef = useRef('');

	useMount(() => {
		getAllHoliday();
	});

	const searchStructures = debounce(async (value) => {
		if (previousStructureRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllHoliday(value);
			}
		}
	}, 500);
	return (
		<>
			{!noNav && <NavLayout title="Holidays" isBack />}
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Holidays</h4>
				<div className="main-table-wrapper">
					<TableWrap>
						<TableHead>
							<Input
								placeholder="search..."
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
									setAddHoliday((prev) => {
										return { ...prev, show: true, edit: false };
									})
								}
							>
								<Add className="mr-2" /> Add New
							</button>
						</TableHead>
						<TableWrap>
							<div className="table__wrap-header" />
							{!isLoading ? (
								<Table responsive>
									{!isLoading && !isEmpty(holidays?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th>Description</th>
													<th>Date</th>
													<th>Recurring</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{holidays?.results?.map((holiday, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{holiday?.name}</td>
														<td className="w-25">
															{trunc(holiday?.description, 70)}
														</td>
														<td>
															{moment(holiday?.date_from).format('MM/YYYY')}
															{holiday?.date_to &&
																` - ${moment(holiday?.date_to).format(
																	'MM/YYYY'
																)}`}
														</td>
														<td>
															<span
																className={`color-${
																	holiday?.recurring ? 'green' : ''
																}`}
															>
																{holiday?.recurring ? 'Yes' : 'No'}
															</span>
														</td>
														<td>
															<span
																className={`status-${
																	holiday?.is_active ? 'active' : 'inactive'
																}`}
															>
																{holiday?.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />

																<Dropdown.Menu>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddHoliday((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: holiday,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{holiday?.is_active && (
																		<Dropdown.Item
																			href="#!"
																			className="red"
																			onClick={(e) => {
																				e.preventDefault();
																				deactivateHoliday(holiday?.id, true);
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
										<p className="text-center m-auto no-data">
											No Holidays Yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Holiday..." />
							)}{' '}
							<Paginate
								total={holidays?.total_pages}
								next={holidays?.next}
								currentPage={holidays?.current_page}
								previous={holidays?.previous}
								getData={getAllHoliday}
								getNext={() => getAllHoliday('', '', holidays?.next)}
								getPrevious={() => getAllHoliday('', '', holidays?.previous)}
							/>{' '}
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>
			<AddHoliday
				show={showAddHoliday?.show}
				closeModal={() =>
					setAddHoliday((prev) => {
						return { ...prev, show: false };
					})
				}
				isEdit={showAddHoliday?.edit}
				data={showAddHoliday?.data}
			/>
		</>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingHoliday,
	holidays: selectAllHolidays,
});

HolidaySetup.propTypes = propTypes;

export default connect(mapStateToProps, {
	getAllHoliday,
	deactivateHoliday,
})(HolidaySetup);
