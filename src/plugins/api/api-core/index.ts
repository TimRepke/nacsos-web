/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { CoreClient } from './CoreClient';


export type { AcademicAuthorModel } from './models/AcademicAuthorModel';
export type { AcademicItemImport } from './models/AcademicItemImport';
export type { AcademicItemModel } from './models/AcademicItemModel';
export type { AffiliationModel } from './models/AffiliationModel';
export type { AnnotatedItem } from './models/AnnotatedItem';
export type { AnnotationFilter } from './models/AnnotationFilter';
export type { AnnotationItem } from './models/AnnotationItem';
export type { AnnotationModel } from './models/AnnotationModel';
export type { AnnotationQualityModel } from './models/AnnotationQualityModel';
export type { AnnotationSchemeInfo } from './models/AnnotationSchemeInfo';
export { AnnotationSchemeLabel } from './models/AnnotationSchemeLabel';
export type { AnnotationSchemeLabelChoice } from './models/AnnotationSchemeLabelChoice';
export type { AnnotationSchemeLabelChoiceFlat } from './models/AnnotationSchemeLabelChoiceFlat';
export type { AnnotationSchemeModel } from './models/AnnotationSchemeModel';
export type { AnnotationSchemeModelFlat } from './models/AnnotationSchemeModelFlat';
export type { AnnotationTrackerModel } from './models/AnnotationTrackerModel';
export type { AnnotationValue } from './models/AnnotationValue';
export type { AssignmentCounts } from './models/AssignmentCounts';
export type { AssignmentFilter } from './models/AssignmentFilter';
export type { AssignmentInfo } from './models/AssignmentInfo';
export type { AssignmentInfoLabel } from './models/AssignmentInfoLabel';
export type { AssignmentModel } from './models/AssignmentModel';
export type { AssignmentScopeEntry } from './models/AssignmentScopeEntry';
export type { AssignmentScopeModel } from './models/AssignmentScopeModel';
export type { AssignmentScopeRandomConfig } from './models/AssignmentScopeRandomConfig';
export type { AssignmentScopeRandomWithExclusionConfig } from './models/AssignmentScopeRandomWithExclusionConfig';
export type { AssignmentScopeRandomWithNQLConfig } from './models/AssignmentScopeRandomWithNQLConfig';
export { AssignmentStatus } from './models/AssignmentStatus';
export type { AuthTokenModel } from './models/AuthTokenModel';
export type { BasicProjectStats } from './models/BasicProjectStats';
export type { Body_login_for_access_token_api_login_token_post } from './models/Body_login_for_access_token_api_login_token_post';
export type { Body_save_resolved_annotations_api_annotations_config_resolve__put } from './models/Body_save_resolved_annotations_api_annotations_config_resolve__put';
export type { BotAnnotationMetaDataBaseModel } from './models/BotAnnotationMetaDataBaseModel';
export type { BotAnnotationModel } from './models/BotAnnotationModel';
export type { BotAnnotationResolution } from './models/BotAnnotationResolution';
export { BotKind } from './models/BotKind';
export type { BotMetaInfo } from './models/BotMetaInfo';
export { BotMetaResolve } from './models/BotMetaResolve';
export { BotMetaResolveBase } from './models/BotMetaResolveBase';
export type { Cashtag } from './models/Cashtag';
export type { ContextAnnotation } from './models/ContextAnnotation';
export type { DehydratedAnnotationTracker } from './models/DehydratedAnnotationTracker';
export type { DehydratedAssignment } from './models/DehydratedAssignment';
export type { DehydratedUser } from './models/DehydratedUser';
export { Event } from './models/Event';
export type { ExampleEvent } from './models/ExampleEvent';
export type { ExampleSubEvent } from './models/ExampleSubEvent';
export { FieldFilter } from './models/FieldFilter';
export { FieldFilters } from './models/FieldFilters';
export { FlatLabel } from './models/FlatLabel';
export type { FlatLabelChoice } from './models/FlatLabelChoice';
export { FlattenedAnnotationSchemeLabel } from './models/FlattenedAnnotationSchemeLabel';
export type { FullLexisNexisItemModel } from './models/FullLexisNexisItemModel';
export type { GenericItemModel } from './models/GenericItemModel';
export type { Hashtag } from './models/Hashtag';
export type { HighlighterModel } from './models/HighlighterModel';
export type { HistogramEntry } from './models/HistogramEntry';
export type { HTTPValidationError } from './models/HTTPValidationError';
export type { IEUUID } from './models/IEUUID';
export { ImportConfigTwitter } from './models/ImportConfigTwitter';
export type { ImportFilter } from './models/ImportFilter';
export type { ImportModel } from './models/ImportModel';
export type { ItemAnnotation } from './models/ItemAnnotation';
export { ItemType } from './models/ItemType';
export type { ItemWithCount } from './models/ItemWithCount';
export type { Label } from './models/Label';
export { LabelFilterBool } from './models/LabelFilterBool';
export { LabelFilterInt } from './models/LabelFilterInt';
export { LabelFilterMulti } from './models/LabelFilterMulti';
export type { LabelOptions } from './models/LabelOptions';
export { LabelScope } from './models/LabelScope';
export type { LexisNexisItemModel } from './models/LexisNexisItemModel';
export type { LexisNexisItemSourceModel } from './models/LexisNexisItemSourceModel';
export type { MakeAssignmentsRequestModel } from './models/MakeAssignmentsRequestModel';
export type { Mention } from './models/Mention';
export type { MetaFilter } from './models/MetaFilter';
export { OpenAlexImport } from './models/OpenAlexImport';
export type { OpenAlexItemImport } from './models/OpenAlexItemImport';
export type { ProjectBaseInfo } from './models/ProjectBaseInfo';
export type { ProjectBaseInfoEntry } from './models/ProjectBaseInfoEntry';
export type { ProjectBaseInfoScopeEntry } from './models/ProjectBaseInfoScopeEntry';
export type { ProjectInfo } from './models/ProjectInfo';
export type { ProjectModel } from './models/ProjectModel';
export type { ProjectPermissionsModel } from './models/ProjectPermissionsModel';
export type { QueryResult } from './models/QueryResult';
export type { RankEntry } from './models/RankEntry';
export { ReferencedTweet } from './models/ReferencedTweet';
export type { ResolutionCell } from './models/ResolutionCell';
export type { ResolutionOrdering } from './models/ResolutionOrdering';
export type { ResolutionProposal } from './models/ResolutionProposal';
export type { ResolutionSnapshotEntry } from './models/ResolutionSnapshotEntry';
export { ResolutionStatus } from './models/ResolutionStatus';
export type { ResolutionUserEntry } from './models/ResolutionUserEntry';
export type { SavedResolution } from './models/SavedResolution';
export type { ScopusCSVImport } from './models/ScopusCSVImport';
export type { SearchResult } from './models/SearchResult';
export type { SnapshotEntry } from './models/SnapshotEntry';
export type { SubQuery } from './models/SubQuery';
export type { TermStats } from './models/TermStats';
export type { TwitterAPIFileImport } from './models/TwitterAPIFileImport';
export type { TwitterDBFileImport } from './models/TwitterDBFileImport';
export type { TwitterItemModel } from './models/TwitterItemModel';
export type { TwitterUserModel } from './models/TwitterUserModel';
export type { URL } from './models/URL';
export type { UserBaseModel } from './models/UserBaseModel';
export type { UserInDBModel } from './models/UserInDBModel';
export type { UserModel } from './models/UserModel';
export type { UserPermission } from './models/UserPermission';
export type { UserProjectAssignmentScope } from './models/UserProjectAssignmentScope';
export { UsersFilter } from './models/UsersFilter';
export type { ValidationError } from './models/ValidationError';
export type { WOSImport } from './models/WOSImport';

export { $AcademicAuthorModel } from './schemas/$AcademicAuthorModel';
export { $AcademicItemImport } from './schemas/$AcademicItemImport';
export { $AcademicItemModel } from './schemas/$AcademicItemModel';
export { $AffiliationModel } from './schemas/$AffiliationModel';
export { $AnnotatedItem } from './schemas/$AnnotatedItem';
export { $AnnotationFilter } from './schemas/$AnnotationFilter';
export { $AnnotationItem } from './schemas/$AnnotationItem';
export { $AnnotationModel } from './schemas/$AnnotationModel';
export { $AnnotationQualityModel } from './schemas/$AnnotationQualityModel';
export { $AnnotationSchemeInfo } from './schemas/$AnnotationSchemeInfo';
export { $AnnotationSchemeLabel } from './schemas/$AnnotationSchemeLabel';
export { $AnnotationSchemeLabelChoice } from './schemas/$AnnotationSchemeLabelChoice';
export { $AnnotationSchemeLabelChoiceFlat } from './schemas/$AnnotationSchemeLabelChoiceFlat';
export { $AnnotationSchemeModel } from './schemas/$AnnotationSchemeModel';
export { $AnnotationSchemeModelFlat } from './schemas/$AnnotationSchemeModelFlat';
export { $AnnotationTrackerModel } from './schemas/$AnnotationTrackerModel';
export { $AnnotationValue } from './schemas/$AnnotationValue';
export { $AssignmentCounts } from './schemas/$AssignmentCounts';
export { $AssignmentFilter } from './schemas/$AssignmentFilter';
export { $AssignmentInfo } from './schemas/$AssignmentInfo';
export { $AssignmentInfoLabel } from './schemas/$AssignmentInfoLabel';
export { $AssignmentModel } from './schemas/$AssignmentModel';
export { $AssignmentScopeEntry } from './schemas/$AssignmentScopeEntry';
export { $AssignmentScopeModel } from './schemas/$AssignmentScopeModel';
export { $AssignmentScopeRandomConfig } from './schemas/$AssignmentScopeRandomConfig';
export { $AssignmentScopeRandomWithExclusionConfig } from './schemas/$AssignmentScopeRandomWithExclusionConfig';
export { $AssignmentScopeRandomWithNQLConfig } from './schemas/$AssignmentScopeRandomWithNQLConfig';
export { $AssignmentStatus } from './schemas/$AssignmentStatus';
export { $AuthTokenModel } from './schemas/$AuthTokenModel';
export { $BasicProjectStats } from './schemas/$BasicProjectStats';
export { $Body_login_for_access_token_api_login_token_post } from './schemas/$Body_login_for_access_token_api_login_token_post';
export { $Body_save_resolved_annotations_api_annotations_config_resolve__put } from './schemas/$Body_save_resolved_annotations_api_annotations_config_resolve__put';
export { $BotAnnotationMetaDataBaseModel } from './schemas/$BotAnnotationMetaDataBaseModel';
export { $BotAnnotationModel } from './schemas/$BotAnnotationModel';
export { $BotAnnotationResolution } from './schemas/$BotAnnotationResolution';
export { $BotKind } from './schemas/$BotKind';
export { $BotMetaInfo } from './schemas/$BotMetaInfo';
export { $BotMetaResolve } from './schemas/$BotMetaResolve';
export { $BotMetaResolveBase } from './schemas/$BotMetaResolveBase';
export { $Cashtag } from './schemas/$Cashtag';
export { $ContextAnnotation } from './schemas/$ContextAnnotation';
export { $DehydratedAnnotationTracker } from './schemas/$DehydratedAnnotationTracker';
export { $DehydratedAssignment } from './schemas/$DehydratedAssignment';
export { $DehydratedUser } from './schemas/$DehydratedUser';
export { $Event } from './schemas/$Event';
export { $ExampleEvent } from './schemas/$ExampleEvent';
export { $ExampleSubEvent } from './schemas/$ExampleSubEvent';
export { $FieldFilter } from './schemas/$FieldFilter';
export { $FieldFilters } from './schemas/$FieldFilters';
export { $FlatLabel } from './schemas/$FlatLabel';
export { $FlatLabelChoice } from './schemas/$FlatLabelChoice';
export { $FlattenedAnnotationSchemeLabel } from './schemas/$FlattenedAnnotationSchemeLabel';
export { $FullLexisNexisItemModel } from './schemas/$FullLexisNexisItemModel';
export { $GenericItemModel } from './schemas/$GenericItemModel';
export { $Hashtag } from './schemas/$Hashtag';
export { $HighlighterModel } from './schemas/$HighlighterModel';
export { $HistogramEntry } from './schemas/$HistogramEntry';
export { $HTTPValidationError } from './schemas/$HTTPValidationError';
export { $IEUUID } from './schemas/$IEUUID';
export { $ImportConfigTwitter } from './schemas/$ImportConfigTwitter';
export { $ImportFilter } from './schemas/$ImportFilter';
export { $ImportModel } from './schemas/$ImportModel';
export { $ItemAnnotation } from './schemas/$ItemAnnotation';
export { $ItemType } from './schemas/$ItemType';
export { $ItemWithCount } from './schemas/$ItemWithCount';
export { $Label } from './schemas/$Label';
export { $LabelFilterBool } from './schemas/$LabelFilterBool';
export { $LabelFilterInt } from './schemas/$LabelFilterInt';
export { $LabelFilterMulti } from './schemas/$LabelFilterMulti';
export { $LabelOptions } from './schemas/$LabelOptions';
export { $LabelScope } from './schemas/$LabelScope';
export { $LexisNexisItemModel } from './schemas/$LexisNexisItemModel';
export { $LexisNexisItemSourceModel } from './schemas/$LexisNexisItemSourceModel';
export { $MakeAssignmentsRequestModel } from './schemas/$MakeAssignmentsRequestModel';
export { $Mention } from './schemas/$Mention';
export { $MetaFilter } from './schemas/$MetaFilter';
export { $OpenAlexImport } from './schemas/$OpenAlexImport';
export { $OpenAlexItemImport } from './schemas/$OpenAlexItemImport';
export { $ProjectBaseInfo } from './schemas/$ProjectBaseInfo';
export { $ProjectBaseInfoEntry } from './schemas/$ProjectBaseInfoEntry';
export { $ProjectBaseInfoScopeEntry } from './schemas/$ProjectBaseInfoScopeEntry';
export { $ProjectInfo } from './schemas/$ProjectInfo';
export { $ProjectModel } from './schemas/$ProjectModel';
export { $ProjectPermissionsModel } from './schemas/$ProjectPermissionsModel';
export { $QueryResult } from './schemas/$QueryResult';
export { $RankEntry } from './schemas/$RankEntry';
export { $ReferencedTweet } from './schemas/$ReferencedTweet';
export { $ResolutionCell } from './schemas/$ResolutionCell';
export { $ResolutionOrdering } from './schemas/$ResolutionOrdering';
export { $ResolutionProposal } from './schemas/$ResolutionProposal';
export { $ResolutionSnapshotEntry } from './schemas/$ResolutionSnapshotEntry';
export { $ResolutionStatus } from './schemas/$ResolutionStatus';
export { $ResolutionUserEntry } from './schemas/$ResolutionUserEntry';
export { $SavedResolution } from './schemas/$SavedResolution';
export { $ScopusCSVImport } from './schemas/$ScopusCSVImport';
export { $SearchResult } from './schemas/$SearchResult';
export { $SnapshotEntry } from './schemas/$SnapshotEntry';
export { $SubQuery } from './schemas/$SubQuery';
export { $TermStats } from './schemas/$TermStats';
export { $TwitterAPIFileImport } from './schemas/$TwitterAPIFileImport';
export { $TwitterDBFileImport } from './schemas/$TwitterDBFileImport';
export { $TwitterItemModel } from './schemas/$TwitterItemModel';
export { $TwitterUserModel } from './schemas/$TwitterUserModel';
export { $URL } from './schemas/$URL';
export { $UserBaseModel } from './schemas/$UserBaseModel';
export { $UserInDBModel } from './schemas/$UserInDBModel';
export { $UserModel } from './schemas/$UserModel';
export { $UserPermission } from './schemas/$UserPermission';
export { $UserProjectAssignmentScope } from './schemas/$UserProjectAssignmentScope';
export { $UsersFilter } from './schemas/$UsersFilter';
export { $ValidationError } from './schemas/$ValidationError';
export { $WOSImport } from './schemas/$WOSImport';

export { AnnotationsService } from './services/AnnotationsService';
export { DefaultService } from './services/DefaultService';
export { EvaluationService } from './services/EvaluationService';
export { EventsService } from './services/EventsService';
export { ExportService } from './services/ExportService';
export { HighlightersService } from './services/HighlightersService';
export { ImportsService } from './services/ImportsService';
export { MailingService } from './services/MailingService';
export { OauthService } from './services/OauthService';
export { ProjectService } from './services/ProjectService';
export { ProjectsService } from './services/ProjectsService';
export { SearchService } from './services/SearchService';
export { StatsService } from './services/StatsService';
export { UsersService } from './services/UsersService';
