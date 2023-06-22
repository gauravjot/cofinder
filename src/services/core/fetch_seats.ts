import { seatsEP } from "@/server_eps";
import { SeatsInfoType } from "@/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Queries API to fetch seats information for a section.
 * @param term_ident an identifier for term
 * @param crn an identifier for section
 * @returns seat information
 */
export const queryFetchSeats = (term_ident: string, crn: number) => {
	return useQuery({
		queryKey: ["seats" + crn],
		queryFn: () => {
			return axios
				.get(seatsEP(term_ident, crn), {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((res) => {
					return {
						seats: {
							Actual: res.data.seats.seats.Actual,
							Capacity: res.data.seats.seats.Capacity,
							Remaining: res.data.seats.seats.Remaining,
						},
						waitlist: {
							Actual: res.data.seats.waitlist.Actual,
							Capacity: res.data.seats.waitlist.Capacity,
							Remaining: res.data.seats.waitlist.Remaining,
						},
					} as SeatsInfoType;
				});
		},
	});
};
