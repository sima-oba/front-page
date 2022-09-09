
export interface Document {
    _id: string
    created_at: string
    updated_at: string
    ordinance_type: string
    ordinance_number: string
    process: string
    publish_date: string
    owner_id: string
    issuer: string
    issuer_name: string
    term: string
    link: string
    details: Details;
}

export interface Details {
    lat: number
    lon: number
}

export const DOCUMENT_TYPES = [
    { type: 'ALTERATION_LICENSE', title: 'Licença de Alteração' },
    { type: 'ANIMAL_HANDLING', title: 'Autorização para Manejo de Fauna' },
    { type: 'CANCEL_', title: 'Cancelamento' },
    { type: 'CONDITION_REVIEW', title: 'Revisão de Condicionante' },
    { type: 'ENVIRONMENTAL_AUTHORIZATION', title: 'Autorização Ambiental' },
    { type: 'ERRATUM', title: 'Errata' },
    { type: 'EXPLORATION_APPROVAL', title: 'Aprovação da Exploração ou Corte de Florestas Plantadas' },
    { type: 'EXTENDED_TERM', title: 'Conceder Prorrogação de Prazo de Validade' },
    { type: 'FOREST_REPLACEMENT_CREDIT', title: 'Emissão de Crédito de Reposição Florestal' },
    { type: 'FOREST_VOLUME_CREDIT', title: 'Emissão de Crédito Florestal' },
    { type: 'FOREST_VOLUME_RECOGNITION', title: 'Reconhecimento de Volume Florestal' },
    { type: 'FOREST_VOLUME_TRANSFER', title: 'Transferência de Crédito de Volume Florestal' },
    { type: 'INSTALLATION_LICENSE', title: 'Licença de Instalação' },
    { type: 'LICENSE_CANCELLATION', title: 'Cancelamento de Licença' },
    { type: 'LICENSE_RENEWAL', title: 'Renovação de Licença' },
    { type: 'LICENSE_REVOCATION', title: 'Revogação de Licença' },
    { type: 'OPERATION_LICENSE', title: 'Licença de Operação' },
    { type: 'OWNER_NAME_CHANGE', title: 'Alteração da Razão Social' },
    { type: 'OWNERSHIP_TRANSFER', title: 'Transferência de Titularidade' },
    { type: 'PLANTING_ANTICIPATION', title: 'Antecipacao de Plantio' },
    { type: 'PRELIMINARY_LICENSE', title: 'Licença Preliminar' },
    { type: 'REGULARIZATION_LICENSE', title: 'Licença de Regularização' },
    { type: 'RIGHT_USE_WATER_RESOURCES', title: 'Outorga do Direito de Uso dos Recursos Hídricos' },
    { type: 'SPECIAL_PROCEDURE', title: 'Autorização por Procedimento Especial' },
    { type: 'UNIFIED_LICENSE', title: 'Licença Unificada' },
    { type: 'VEGETAL_SUPPRESSION', title: 'Autorização de Supressão de Vegetação Nativa' },
    { type: 'LOCATION_LICENSE', title: 'Licença de Localização' },
    { type: 'OWNER_CORRECTION', title: 'Retífica da Razão Social' },
    { type: 'IMPLANTATION_LICENSE', title: 'Licença de Implantação' },
    { type: 'INFRACTION_WARNING', title: 'Auto de Infração de Advertência' },
    { type: 'INTERDICTION_INFRACTION', title: 'Embargo e Interdição' },
    { type: 'DEMOLITION_PENALTY', title: 'Auto de Infração de Interdição' },
    { type: 'FINE_INFRACTION', title: 'Auto de Infração de Multa' },
    { type: 'SEIZURE_INFRACTION', title: 'Auto de Infração de Apreensão' },
    { type: 'ACTIVE_DEBIT', title: 'Dívida Ativa' },
    { type: 'GRANT_PROCESS', title: 'Análise de Processo de Outorga' },
    { type: 'PROCESS_EXTINCTION', title: 'Extinção de Processo' },
    { type: 'ANTICIPATED_ENVIRONMENTAL_LICENSE', title: 'Antecipação de Licença Ambiental' },
    { type: 'NOTIFICATION_NOTICE', title: 'Licença Ambiental Prévial' },
    { type: 'SIMPLIFIED_ENVIRONMENTAL_LICENSE', title: 'Licença Simplificada' },
    { type: 'DEADLINE_EXTENSION', title: 'Prorrogação de Prazo de Validade' },
    { type: 'RECTIFICATION', title: 'Retificação de Portaria' },
    { type: 'ORDER_REVOCATION', title: 'Revogação Licença' },
    { type: 'SEIZURE', title: 'Interdição' },
    { type: 'DEGRADED_AREA_RECOVERY_PLAN', title: 'Plano de Recuperação de Área Degradada' },
    { type: 'ADMINISTRATIVE_DECISION', title: 'Decisão Administrativa' },
    { type: 'CONFORMITY_CERTIFICATE', title: 'Certidão de Conformidade de Uso e Ocupação do Solo' },
    { type: 'ICMBIO_INFRACTION_NOTICE', title: 'Autos de Infração Emitidos pelo ICMBio' },
    { type: 'IBAMA_INFRACTION_NOTICE', title: 'Autos de Infração Emitidos Pelo IBAMA' },
    { type: 'LICENSE_DISMISSAL', title: 'Dispensa de Licença Ambiental' },
    { type: 'LEGAL_RESERVE_LOCATION_APPROVAL', title: 'Aprovação de Localização de Reserva Legal' },
    { type: 'TEMPORARY_INTERDICTION_NOTICE', title: 'Auto de Infração de Interdição Temporária' },
    { type: 'PROCESS_ANALYSIS', title: 'Análise de Processo' },
    { type: 'PLANT_ENRICHMENT_PLAN', title: 'Plano de Enriquecimento Vegetal' },
    { type: 'TEMPORARY_SEIZURE', title: 'Embargo Temporário' },
    { type: 'PENALTY_WARNING', title: 'Penalidade de Advertência' },
    { type: 'CEFIR', title: 'Cadastro Estadual Florestal de Imóveis Rurais' },
    { type: 'SOLID_WASTE_MANAGEMENT_PLAN', title: 'Programa de Gerenciamento de Resíduos Sólidos' },
    { type: 'RIGHT_USE_WATER_RESOURCES_RENOVATION', title: 'Renovação da Outorga do Direito de Uso dos Recursos Hídricos' },
    { type: 'RIGHT_USE_WATER_RESOURCES_CHANGE', title: 'Alteração da Outorga do Direito de Uso dos Recursos Hídricos' },
    { type: 'VOLUME_EXPASION', title: 'Ampliação do volume' },
    { type: 'PREVENTIVE', title: 'Preventiva' },
    { type: 'TEMPORARY_SUSPEND', title: 'Suspender Temporariamente' }
]