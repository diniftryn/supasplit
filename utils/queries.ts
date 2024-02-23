// import { createClient } from "./supabase/server";

// export async function fetchGroupByGroupId(groupId: string | number) {
//   const supabase = createClient();

//   const { data, error } = await supabase.from("groups").select().eq("id", groupId);
//   if (error) console.log("Unable to fetch group. Error: " + error);
//   if (data) {
//     console.log("group: " + JSON.stringify(data));
//     return data;
//   }
// }

// export async function fetchGroupUsersByGroup(group: Group) {
//   const supabase = createClient();

//   const { data, error } = await supabase.from("users").select().in("id", group.userIds);
//   if (error) console.log("Unable to fetch group users. Error: " + error);
//   if (data) {
//     console.log("groupUsers: " + JSON.stringify(data));
//     return data;
//   }
// }

// export async function fetchGroupUsersByGroupId(groupId: string | number) {
//   const group = fetchGroupByGroupId(groupId);
//   if (group) fetchGroupUsersByGroup(group);
// }
