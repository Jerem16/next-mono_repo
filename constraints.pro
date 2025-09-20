gen_enforced_dependency(WorkspaceCwd, DepName, _DepRange) :-
  workspace_has_dependency(WorkspaceCwd, DepName, _),
  \+ is_workspace_protocol(WorkspaceCwd, DepName),
  format("~s doit utiliser workspace:* pour ~s", [WorkspaceCwd, DepName]).

is_workspace_protocol(WorkspaceCwd, DepName) :-
  get_workspace_dependency(WorkspaceCwd, DepName, Range),
  string_starts_with(Range, "workspace:").

% Interdire deps circulaires entre apps
violates_layering_policy(From, To) :-
  string_starts_with(From, "apps/"),
  string_starts_with(To, "apps/").
