import { create } from "zustand";
import supabase from "./supabase";  // Make sure you have a supabase client instance

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      // Query Supabase for the user information by UID
      const { data, error } = await supabase
        .from("users")  // Replace "users" with your table name
        .select("*")
        .eq("id", uid)
        .single();  // Get a single row result

      if (error) {
        console.log(error.message);
        set({ currentUser: null, isLoading: false });
        return;
      }

      if (data) {
        set({ currentUser: data, isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
