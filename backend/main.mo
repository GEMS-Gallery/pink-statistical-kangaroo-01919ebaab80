import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor {
  // Define the Project type
  public type Project = {
    id: Nat;
    title: Text;
    category: Text;
    url: Text;
  };

  // Initialize projects array
  stable var projects : [Project] = [];
  stable var nextId : Nat = 0;

  // Initialize categories HashMap
  let categories = HashMap.HashMap<Text, [Nat]>(10, Text.equal, Text.hash);

  // Get all projects
  public query func getProjects() : async [Project] {
    projects
  };

  // Add a new project
  public func addProject(title: Text, category: Text, url: Text) : async Result.Result<Nat, Text> {
    let id = nextId;
    nextId += 1;

    let newProject : Project = {
      id;
      title;
      category;
      url;
    };

    projects := Array.append(projects, [newProject]);

    // Update categories
    switch (categories.get(category)) {
      case null {
        categories.put(category, [id]);
      };
      case (?ids) {
        categories.put(category, Array.append(ids, [id]));
      };
    };

    #ok(id)
  };

  // Get projects by category
  public query func getProjectsByCategory(category: Text) : async [Project] {
    switch (categories.get(category)) {
      case null { [] };
      case (?ids) {
        Array.mapFilter<Nat, Project>(ids, func (id) {
          Array.find<Project>(projects, func (p) { p.id == id })
        })
      };
    }
  };

  // Get all categories
  public query func getCategories() : async [Text] {
    Iter.toArray(categories.keys())
  };
}
