/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/* ----------------------------- SEO  PropTypes ----------------------------- */
const propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
};

const SEO = ({ title, description }) => {
	return (
		<Helmet>
			<title>
				{title ? `${title} ` : ' A better system to payroll '} &bull; Soft Codes
			</title>
			<meta
				name="description"
				content={
					description ? `${description}` : 'We are shaping payroll managment.'
				}
			/>
			<meta
				property="og:description"
				content={
					description ? `${description}` : 'We are shaping payroll managment.'
				}
			/>
		</Helmet>
	);
};

SEO.propTypes = propTypes;
export default SEO;
