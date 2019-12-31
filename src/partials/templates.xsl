<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="bg-tree">
	<xsl:for-each select="./*">
		<div>
			<xsl:attribute name="class">tree-item <xsl:if test="position() = 1">active</xsl:if></xsl:attribute>
			<xsl:attribute name="data-type"><xsl:value-of select="@type"/></xsl:attribute>
			<span class="icon">
				<xsl:attribute name="style">background-image: url(/res/icons/<xsl:choose>
						<xsl:when test="@icon = 'color-wheel'">icon-color-preset</xsl:when>
						<xsl:otherwise>tiny-generic-folder</xsl:otherwise>
					</xsl:choose>)</xsl:attribute>
			</span>
			<span class="name"><xsl:value-of select="@name"/></span>
		</div>
	</xsl:for-each>
</xsl:template>

<xsl:template name="bg-list">
	<xsl:for-each select="./*">
		<div>
			<xsl:attribute name="class">bg-preview</xsl:attribute>
			<xsl:attribute name="style"><xsl:value-of select="." disable-output-escaping="yes"/></xsl:attribute>
		</div>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>

