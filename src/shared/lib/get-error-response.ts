const getErrorResponse= async (status: number, statusText: string, data: any) =>{
	return new Response(data?JSON.stringify(data):null, {
		status,
		statusText,
	});
}

export default getErrorResponse;

