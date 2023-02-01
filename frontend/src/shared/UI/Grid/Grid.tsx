import React, { forwardRef } from 'react';
import MuiGrid, { GridProps } from '@material-ui/core/Grid';

interface IProps {
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Grid = forwardRef<HTMLDivElement, GridProps & IProps>((props, ref) => {
    const { children, onClick, ...other } = props;

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <MuiGrid ref={ref} onClick={onClick} {...other}>
            {children}
        </MuiGrid>
    );
});

Grid.displayName = 'Grid';

export default React.memo(Grid);
