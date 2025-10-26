import { useMemo, type FC } from "react";
import { Button } from "@/components/ui/button";

interface Props {
	pagination: {
		page: number;
		size: number;
		total: number;
	};
	onChange: (page: number) => void;
}

const SimplePagination: FC<Props> = ({ pagination, onChange }) => {
	const totalPages = useMemo(
		() => Math.ceil(pagination.total / pagination.size),
		[pagination.total, pagination.size]
	);
	const showNext = pagination.page < totalPages;
	const showPrev = pagination.page > 1;

	return (
		<div className="flex flex-row items-center justify-center gap-2">
			<Button variant="outline" onClick={() => onChange(pagination.page - 1)} disabled={!showPrev}>
				Previous
			</Button>

			<p className="text-sm font-medium">
				Page {pagination.page} of {totalPages}
			</p>

			<Button variant="outline" onClick={() => onChange(pagination.page + 1)} disabled={!showNext}>
				Next
			</Button>
		</div>
	);
};

export default SimplePagination;
