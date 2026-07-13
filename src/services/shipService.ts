import { supabase } from "./supabase";

export async function getShips() {

  const { data, error } = await supabase
    .from("ships")
    .select("*");

  if (error) throw error;

  return data;

}