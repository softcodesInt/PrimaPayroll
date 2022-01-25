import React from 'react';
import { Pagination } from 'react-bootstrap';
import styled from 'styled-components';

const Paginate = ({
	next,
	previous,
	total,
	getNext,
	getData,
	getPrevious,
	currentPage,
}) => {
	return (
		<>
			<PaginateWrapper>
				<div className="pagination__input">
					<p>
						Page <input value={currentPage} disabled /> of {total}
					</p>
				</div>
				<Pagination>
					<Pagination.Prev
						onClick={(e) => {
							e.preventDefault();

							if (previous) {
								getPrevious();
							}
						}}
						disabled={!previous}
					/>
					{Array.from({ length: total }, (_, pages) => (
						<>
							<Pagination.Item
								onClick={() => getData('', pages + 1)}
								active={currentPage === pages + 1}
							>
								{pages + 1}
							</Pagination.Item>
						</>
					))}

					<Pagination.Next
						onClick={(e) => {
							e.preventDefault();
							if (next) {
								getNext();
							}
						}}
						disabled={!next}
					/>
				</Pagination>
			</PaginateWrapper>
		</>
	);
};

const PaginateWrapper = styled.div`
	margin-top: 2.7rem;
	display: flex;
	.page-link {
		color: var(--gray);
		border: 0px solid #dee2e6 !important;
		font-size: var(--font-p);
	}
	.page-item.active .page-link {
		color: var(--text-black) !important;
		background-color: transparent !important;
	}
	.pagination {
		margin-left: auto;
	}
	.pagination__input {
		p {
			font-size: 14px;
			color: var(--text-gray);
			margin: 0;
		}
		input {
			width: 35px;
			/* background: red; */
			background: #f8f8f9;
			border-radius: 4px;
			border: none;
			padding: 8px;
			font-size: 14px;
			text-align: center;
		}
	}
`;

export default Paginate;
