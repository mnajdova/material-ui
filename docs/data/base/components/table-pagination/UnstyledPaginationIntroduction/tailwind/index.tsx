import * as React from 'react';
import clsx from 'clsx';
import { useTheme } from '@mui/system';
import { TablePagination, TablePaginationProps } from '@mui/base/TablePagination';

function useIsDarkMode() {
  const theme = useTheme();
  return theme.palette.mode === 'dark';
}

export default function UnstyledPaginationIntroduction() {
  // Replace this with your app logic for determining dark mode
  const isDarkMode = useIsDarkMode();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div
      className={isDarkMode ? 'dark' : ''}
      style={{ width: 500, maxWidth: '100%' }}
    >
      <table
        aria-label="custom pagination table"
        className="text-sm [&>th]:p-4 [&>td]:p-4 border border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-md w-full"
      >
        <tfoot>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={13}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  'aria-label': 'rows per page',
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const callable = (fn: any, args: any) => (typeof fn === 'function' ? fn(args) : fn);

const CustomTablePagination = React.forwardRef<
  HTMLTableCellElement,
  TablePaginationProps
>((props, ref) => {
  return (
    <TablePagination
      ref={ref}
      {...props}
      className={clsx('CustomTablePagination p-4', props.className)}
      slotProps={{
        ...props.slotProps,
        select: (ownerState) => {
          const resolvedSlotProps = callable(props.slotProps?.select, ownerState);
          return {
            ...resolvedSlotProps,
            className: clsx(
              'py-0.5 px-1.5 border border-solid border-slate-200 dark:border-slate-800 rounded-3xl bg-transparent hover:bg-slate-20 hover:dark:bg-slate-800 focus:outline-0 focus:shadow-outline-purple-xs',
              resolvedSlotProps?.className,
            ),
          };
        },
        actions: (ownerState) => {
          const resolvedSlotProps = callable(props.slotProps?.actions, ownerState);
          return {
            ...resolvedSlotProps,
            className: clsx(
              'p-0.5 border border-solid border-slate-200 dark:border-slate-800 rounded-3xl text-center [&>button]:my-0 [&>button]:mx-2 [&>button]:border-none [&>button]:rounded-sm [&>button]:bg-transparent [&>button:hover]:bg-slate-50 [&>button:hover]:dark:bg-slate-800 [&>button:focus]:outline-0 [&>button:focus]:shadow-outline-purple-xs',
              resolvedSlotProps?.className,
            ),
          };
        },
        spacer: (ownerState) => {
          const resolvedSlotProps = callable(props.slotProps?.spacer, ownerState);

          return {
            ...resolvedSlotProps,
            className: clsx('hidden', resolvedSlotProps?.className),
          };
        },
        toolbar: (ownerState) => {
          const resolvedSlotProps = callable(props.slotProps?.toolbar, ownerState);
          return {
            ...resolvedSlotProps,
            className: clsx(
              'flex flex-col items-start gap-2.5 md:flex-row md:items-center',
              resolvedSlotProps?.className,
            ),
          };
        },
        selectLabel: (ownerState) => {
          const resolvedSlotProps = callable(
            props.slotProps?.selectLabel,
            ownerState,
          );
          return {
            ...resolvedSlotProps,
            className: clsx('m-0', resolvedSlotProps?.className),
          };
        },
        displayedRows: (ownerState) => {
          const resolvedSlotProps = callable(
            props.slotProps?.displayedRows,
            ownerState,
          );
          return {
            ...resolvedSlotProps,
            className: clsx('m-0 md:ml-auto', resolvedSlotProps?.className),
          };
        },
      }}
    />
  );
});
