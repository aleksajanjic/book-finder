function Header() {
	return (
		<div className="bg-surface-card text-text-primary font-extrabold text-2xl flex justify-between items-center p-2 rounded-md">
			📚 BookFinder
			<div className="font-normal text-text-secondary text-sm border-2 border-border rounded-full py-[3px] px-[15px]">
				Recently Viewed (3)
			</div>
		</div>
	);
}

export default Header;
