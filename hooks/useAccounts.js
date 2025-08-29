"use client";
import { useBank } from "../context/BankContext";

export function useAccounts(/* userId = "1" */) {
  const { loading, error, accounts, userName } = useBank();
  return { loading, error, accounts, userName };
}
